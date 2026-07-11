const mongoose = require('mongoose');
const Product = require('../models/Product');

const pickProductFields = (body) => {
  return {
    name: body.name,
    category: body.category,
    description: body.description,
    price: Number(body.price),
    stock: Number(body.stock),
    image: body.image,
  };
};

const validateProductInput = (data) => {
  if (!data.name || data.name.trim().length < 2) return 'Product name is required.';
  if (!data.category || data.category.trim().length < 2) return 'Category is required.';
  if (!data.description || data.description.trim().length < 5) return 'Description is required.';
  if (!data.image || data.image.trim().length < 3) return 'Image is required.';
  if (!Number.isFinite(data.price) || data.price < 1) return 'Price must be greater than 0.';
  if (!Number.isInteger(data.stock) || data.stock < 0) return 'Stock must be 0 or more.';
  return null;
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: 'Invalid product ID.' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ error: 'Product not found.' });
    }

    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const data = pickProductFields(req.body);
    const validationError = validateProductInput(data);

    if (validationError) {
      return res.status(400).send({ error: validationError });
    }

    const product = new Product(data);
    await product.save();

    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: 'Invalid product ID.' });
    }

    const data = pickProductFields(req.body);
    const validationError = validateProductInput(data);

    if (validationError) {
      return res.status(400).send({ error: validationError });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).send({ error: 'Product not found.' });
    }

    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ error: 'Invalid product ID.' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send({ error: 'Product not found.' });
    }

    res.send({ message: 'Product deleted.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};