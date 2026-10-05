const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { auth, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', auth, admin, upload.single('image'), createProduct);

router.put('/:id', auth, admin, upload.single('image'), updateProduct);

router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;