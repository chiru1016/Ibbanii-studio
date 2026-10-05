const mongoose = require('mongoose');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ibbanii/products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return;

  try {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (!match) return;

    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ error: 'Please fill all product fields.' });
    }

    let image = req.body.image || '';

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      image = uploaded.secure_url;
    }

    if (!image) {
      return res.status(400).json({ error: 'Please select a product image.' });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ error: error.message || 'Failed to create product.' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const { name, description, price, category, stock } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category.trim();
    if (stock !== undefined) product.stock = Number(stock);

    if (req.file) {
      const oldImage = product.image;
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      product.image = uploaded.secure_url;
      await deleteCloudinaryImage(oldImage);
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ error: error.message || 'Failed to update product.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await deleteCloudinaryImage(product.image);
    await product.deleteOne();

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
