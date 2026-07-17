const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    addressLine: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
    },

    cartItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order must contain at least one item.',
      },
    },

    productTotal: {
      type: Number,
      required: true,
      min: 1,
    },

    deliveryCharge: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },

    orderStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);