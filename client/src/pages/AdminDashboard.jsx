import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Package, ShoppingBag, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '40px' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        <Link to="/admin/add-product" className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <PlusCircle size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h3>Add New Product</h3>
          <p style={{ color: '#666' }}>List a new handmade item for sale</p>
        </Link>

        <Link to="/admin/products" className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Package size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h3>Manage Products</h3>
          <p style={{ color: '#666' }}>Update stock, prices, or edit details</p>
        </Link>

        <Link to="/admin/orders" className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h3>Manage Orders</h3>
          <p style={{ color: '#666' }}>View orders and update status</p>
        </Link>

        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <BarChart size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h3>Analytics</h3>
          <p style={{ color: '#666' }}>Coming Soon: Sales reports</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
