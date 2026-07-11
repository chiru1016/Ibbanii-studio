const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },

  price: {
    type: Number,
    required: true,
    min: 1,
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },

  image: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);