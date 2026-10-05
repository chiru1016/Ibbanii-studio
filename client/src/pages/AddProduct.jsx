import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setPreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    setError('');
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!imageFile) {
      setError('Please select a product image from your gallery.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('image', imageFile);

      await api.post('/api/products', data);

      setSuccess('Product added successfully.');

      setTimeout(() => {
        navigate('/admin/products');
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to add product.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Add New Product</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <small>Choose an image from your computer/gallery. Maximum 5 MB.</small>
          </div>

          {preview && (
            <div style={{ marginBottom: '20px' }}>
              <p>Image Preview</p>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
