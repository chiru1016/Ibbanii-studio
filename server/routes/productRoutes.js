const express = require('express');

const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { auth, admin } = require('../middleware/authMiddleware');

const router = express.Router();

/*
  PUBLIC ROUTES
  Anyone can see products without login
*/
router.get('/', getAllProducts);
router.get('/:id', getProductById);

/*
  ADMIN ONLY ROUTES
  Only admin can add, update, delete products
*/
router.post('/', auth, admin, addProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
