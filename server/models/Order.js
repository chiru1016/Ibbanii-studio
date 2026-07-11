const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  name: {
    type: String,
    required: true,
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
}, { _id: false });

const orderSchema = new mongoose.Schema({
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

  cartItems: {
    type: [orderItemSchema],
    required: true,
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
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);