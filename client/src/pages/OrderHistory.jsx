import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/myorders');
      setOrders(res.data || []);
    } catch (error) {
      console.error('Order history error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 20px' }}>
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '50px 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <h3>No orders found</h3>
          <p style={{ color: 'var(--text-light)', margin: '12px 0 24px' }}>
            After you place an order, it will appear here.
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="card"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ marginBottom: '8px' }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </h3>

                <p style={{ color: 'var(--text-light)', marginBottom: '6px' }}>
                  Date:{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>

                <p style={{ color: 'var(--text-light)', marginBottom: '6px' }}>
                  Items: {order.cartItems?.length || 0}
                </p>

                <p style={{ fontWeight: 700, marginBottom: '6px' }}>
                  Total: ₹{order.totalAmount}
                </p>

                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    background:
                      order.orderStatus === 'Delivered'
                        ? '#dcfce7'
                        : order.orderStatus === 'Cancelled'
                          ? '#fee2e2'
                          : '#fef3c7',
                    color:
                      order.orderStatus === 'Delivered'
                        ? '#166534'
                        : order.orderStatus === 'Cancelled'
                          ? '#dc2626'
                          : '#92400e',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {order.orderStatus}
                </span>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="btn-primary"
                style={{ whiteSpace: 'nowrap' }}
              >
                Track Order
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;