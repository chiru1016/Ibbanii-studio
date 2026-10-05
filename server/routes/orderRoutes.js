const express = require('express');

const {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { auth, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/razorpay', auth, createRazorpayOrder);
router.post('/verify', auth, verifyPayment);

router.get('/myorders', auth, getUserOrders);
router.get('/:id', auth, getOrderById);

router.get('/', auth, admin, getAllOrders);
router.put('/:id', auth, admin, updateOrderStatus);

module.exports = router;