import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { orderStatus: status });
      fetchOrders();
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '40px' }}>Manage Orders</h1>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Order ID</th>
              <th style={{ padding: '15px' }}>Customer</th>
              <th style={{ padding: '15px' }}>Total</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{order._id.substring(10).toUpperCase()}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.email}</div>
                </td>
                <td style={{ padding: '15px' }}>₹{order.totalAmount}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '15px', 
                    fontSize: '0.8rem',
                    backgroundColor: order.orderStatus === 'Delivered' ? '#dcfce7' : '#fef9c3',
                    color: order.orderStatus === 'Delivered' ? '#166534' : '#854d0e'
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ padding: '5px', fontSize: '0.8rem' }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
