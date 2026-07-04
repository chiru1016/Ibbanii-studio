import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Flowers',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', formData);
      navigate('/admin/products');
    } catch (error) {
      alert('Error adding product');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
        <h2 style={{ marginBottom: '30px' }}>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Product Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="Flowers">Flowers</option>
              <option value="Dolls">Dolls</option>
              <option value="Toys">Toys</option>
              <option value="Decor">Decor</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Price (INR)</label>
            <input type="number" name="price" required value={formData.price} onChange={handleInputChange} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Stock Quantity</label>
            <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Image URL</label>
            <input type="text" name="image" required value={formData.image} placeholder="https://example.com/image.jpg" onChange={handleInputChange} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
            <textarea rows="4" name="description" required value={formData.description} onChange={handleInputChange}></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
