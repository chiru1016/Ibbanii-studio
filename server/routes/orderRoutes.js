const express = require('express');
const { 
  createRazorpayOrder, 
  verifyPayment, 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { auth, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/razorpay', auth, createRazorpayOrder);
router.post('/verify', auth, verifyPayment);
router.post('/', auth, createOrder);
router.get('/myorders', auth, getUserOrders);

// Admin only routes
router.get('/', auth, admin, getAllOrders);
router.put('/:id', auth, admin, updateOrderStatus);

module.exports = router;
