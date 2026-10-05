import React, { useState, useEffect } from 'react';
import api from '../api';
import { getImageUrl } from '../utils/image';
import { Trash2, Edit, X, Save } from 'lucide-react';

const categories = ['Flowers', 'Dolls', 'Toys', 'Decor', 'Accessories'];

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // null = modal closed
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      description: product.description,
    });
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/api/products/${editingProduct}`, editForm);
      setProducts(products.map(p => p._id === editingProduct ? res.data : p));
      closeEdit();
    } catch (error) {
      alert('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '40px' }}>Manage Products</h1>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Product</th>
              <th style={{ padding: '15px' }}>Category</th>
              <th style={{ padding: '15px' }}>Price</th>
              <th style={{ padding: '15px' }}>Stock</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={getImageUrl(product.image)}
                    alt=""
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  {product.name}
                </td>
                <td style={{ padding: '15px' }}>{product.category}</td>
                <td style={{ padding: '15px' }}>₹{product.price}</td>
                <td style={{ padding: '15px' }}>{product.stock}</td>
                <td style={{ padding: '15px' }}>
                  <button
                    onClick={() => openEdit(product)}
                    style={{ background: 'none', color: 'var(--primary)', marginRight: '10px' }}
                    title="Edit product"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    style={{ background: 'none', color: 'var(--error)' }}
                    title="Delete product"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Edit Product</h2>
              <button onClick={closeEdit} style={{ background: 'none', color: '#666' }}>
                <X size={24} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Product Name</label>
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Category</label>
                <select name="category" value={editForm.category} onChange={handleEditChange}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Price (₹)</label>
                  <input type="number" name="price" value={editForm.price} onChange={handleEditChange} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Stock</label>
                  <input type="number" name="stock" value={editForm.stock} onChange={handleEditChange} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Image URL</label>
                <input type="text" name="image" value={editForm.image} onChange={handleEditChange} placeholder="https://example.com/image.jpg" />
                {editForm.image && (
                  <img
                    src={getImageUrl(editForm.image)}
                    alt="Preview"
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Description</label>
                <textarea rows="3" name="description" value={editForm.description} onChange={handleEditChange} />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={closeEdit}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
