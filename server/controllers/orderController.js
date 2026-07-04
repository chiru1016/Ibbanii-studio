const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderNotification } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).send({ error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, cartItems, totalAmount, razorpayOrderId, razorpayPaymentId } = req.body;
    
    // Server-side validation/calculation could be added here
    
    const order = new Order({
      userId: req.user._id,
      customerName,
      email,
      phone,
      address,
      cartItems,
      totalAmount,
      paymentStatus: 'Paid',
      orderStatus: 'Paid',
      razorpayOrderId,
      razorpayPaymentId,
    });

    await order.save();

    // Update stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Send Notification to Owner
    await sendOrderNotification(order);

    res.status(201).send(order);
  } catch (error) {
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
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
    if (!order) return res.status(404).send({ error: 'Order not found' });
    res.send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, createOrder, getUserOrders, getAllOrders, updateOrderStatus };
