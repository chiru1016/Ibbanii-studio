import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      setPreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image must be less than 5MB.');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const token = localStorage.getItem('token');

      const data = new FormData();

      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('image', image);

      await axios.post(
        `${API_URL}/api/products`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('Product added successfully.');

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
      });

      setImage(null);
      setPreview('');
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.error ||
        'Failed to add product.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <label>
          Product Image
        </label>

        <br />
        <br />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {preview && (
          <div style={{ marginTop: '20px' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>

      </form>

      {message && (
        <p style={{ marginTop: '20px' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddProduct;