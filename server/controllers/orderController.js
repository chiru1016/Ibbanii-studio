const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderNotification } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const validOrderStatuses = ['Pending', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const normalizeCartItems = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart is empty.');
  }

  return cartItems.map((item) => {
    const productId = item.productId || item._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product in cart.');
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error('Invalid quantity in cart.');
    }

    return {
      productId,
      quantity,
    };
  });
};

const buildSecureOrderItems = async (cartItems) => {
  const normalizedItems = normalizeCartItems(cartItems);
  const productIds = normalizedItems.map((item) => item.productId);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  if (products.length !== productIds.length) {
    throw new Error('Some products in your cart are invalid.');
  }

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const secureItems = [];
  let totalAmount = 0;

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId.toString());

    if (!product) {
      throw new Error('Invalid product in cart.');
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} has only ${product.stock} item(s) available.`);
    }

    const secureItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    };

    secureItems.push(secureItem);
    totalAmount += product.price * item.quantity;
  }

  return { secureItems, totalAmount };
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { cartItems, address } = req.body;

    if (!address || address.trim().length < 10) {
      return res.status(400).send({ error: 'Please enter a complete delivery address.' });
    }

    if (!req.user.email && !req.user.phone) {
      return res.status(400).send({ error: 'Your profile must have email or phone number.' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).send({ error: 'Razorpay keys are missing in server .env file.' });
    }

    const { secureItems, totalAmount } = await buildSecureOrderItems(cartItems);

    const pendingOrder = await Order.create({
      userId: req.user._id,
      customerName: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: address.trim(),
      cartItems: secureItems,
      totalAmount,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: pendingOrder._id.toString(),
      notes: {
        appOrderId: pendingOrder._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    pendingOrder.razorpayOrderId = razorpayOrder.id;
    await pendingOrder.save();

    res.json({
      appOrderId: pendingOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      appOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appOrderId)) {
      return res.status(400).send({ error: 'Invalid app order ID.' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({ error: 'Missing Razorpay payment details.' });
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      await Order.findByIdAndUpdate(appOrderId, {
        paymentStatus: 'Failed',
      });

      return res.status(400).send({ error: 'Invalid payment signature.' });
    }

    let paidOrder;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: appOrderId,
        userId: req.user._id,
        razorpayOrderId: razorpay_order_id,
      }).session(session);

      if (!order) {
        throw new Error('Order not found.');
      }

      if (order.paymentStatus === 'Paid') {
        paidOrder = order;
        return;
      }

      if (order.paymentStatus !== 'Pending') {
        throw new Error('This order is not pending payment.');
      }

      for (const item of order.cartItems) {
        const stockUpdate = await Product.updateOne(
          {
            _id: item.productId,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(`${item.name} is out of stock.`);
        }
      }

      order.paymentStatus = 'Paid';
      order.orderStatus = 'Paid';
      order.razorpayPaymentId = razorpay_payment_id;

      await order.save({ session });
      paidOrder = order;
    });

    session.endSession();

    if (paidOrder && paidOrder.paymentStatus === 'Paid') {
      await sendOrderNotification(paidOrder);
    }

    res.json({
      message: 'Payment verified and order placed successfully.',
      order: paidOrder,
    });
  } catch (error) {
    session.endSession();
    res.status(400).send({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone role')
      .sort({ createdAt: -1 });

    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!validOrderStatuses.includes(orderStatus)) {
      return res.status(400).send({ error: 'Invalid order status.' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: 'Invalid order ID.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).send({ error: 'Order not found.' });
    }

    res.send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};