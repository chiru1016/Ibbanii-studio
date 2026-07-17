import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { getImageUrl } from '../utils/image';

const steps = ['Paid', 'Packed', 'Shipped', 'Delivered'];

const getStepIndex = (status) => {
  if (status === 'Pending') return -1;
  if (status === 'Cancelled') return -1;
  return steps.indexOf(status);
};

const OrderTracking = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Order tracking error:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 20px' }}>
        <h2>Loading order tracking...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '50px 20px' }}>
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <h2>Order not found</h2>
          <Link to="/orders" className="btn-primary" style={{ marginTop: '20px' }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const activeStep = getStepIndex(order.orderStatus);

  return (
    <div className="container" style={{ padding: '50px 20px' }}>
      <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px' }}>Track Your Order</h1>

        <p style={{ color: 'var(--text-light)', marginBottom: '6px' }}>
          Order Code: <strong>{order._id.slice(-10).toUpperCase()}</strong>
        </p>

        <p style={{ color: 'var(--text-light)' }}>
          Placed on:{' '}
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>

        <div
          style={{
            marginTop: '34px',
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: '10px',
            position: 'relative',
          }}
        >
          {steps.map((step, index) => {
            const completed = index <= activeStep;

            return (
              <div
                key={step}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    margin: '0 auto 10px',
                    background: completed ? '#22c55e' : '#e5e7eb',
                    color: completed ? '#fff' : '#777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {completed ? '✓' : index + 1}
                </div>

                <p
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: completed ? '#16a34a' : '#777',
                  }}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>

        {order.orderStatus === 'Cancelled' && (
          <div
            style={{
              marginTop: '25px',
              padding: '14px 18px',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '12px',
              fontWeight: 700,
            }}
          >
            This order has been cancelled.
          </div>
        )}

        {order.orderStatus === 'Delivered' && (
          <div
            style={{
              marginTop: '25px',
              padding: '14px 18px',
              background: '#dcfce7',
              color: '#166534',
              borderRadius: '12px',
              fontWeight: 700,
            }}
          >
            Your order has been delivered.
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Order Details</h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          {order.cartItems.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '16px',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                paddingBottom: '14px',
              }}
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />

              <div>
                <h4>{item.name}</h4>
                <p style={{ color: 'var(--text-light)' }}>
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>

              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 800,
          }}
        >
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Delivery Address</h2>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.7 }}>
          {order.address}
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;