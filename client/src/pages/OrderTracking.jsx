import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { getImageUrl } from '../utils/image';

const steps = ['Paid', 'Packed', 'Shipped', 'Delivered'];

const getStepIndex = (status) => {
  if (!status || status === 'Pending' || status === 'Cancelled') return -1;
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
  const progressPercent =
    activeStep <= 0 ? 0 : (activeStep / (steps.length - 1)) * 100;

  return (
    <div className="container" style={{ padding: '50px 20px' }}>
      <div
        className="card"
        style={{
          padding: '36px',
          marginBottom: '30px',
          border: '1px solid rgba(216, 77, 103, 0.25)',
        }}
      >
        <h1 style={{ marginBottom: '12px' }}>Track Your Order</h1>

        <p style={{ color: 'var(--text-light)', marginBottom: '6px' }}>
          Order Code:{' '}
          <strong>{order._id?.slice(-10).toUpperCase()}</strong>
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
            position: 'relative',
            marginTop: '50px',
            padding: '0 20px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '17px',
              left: '12%',
              right: '12%',
              height: '5px',
              background: '#e5e7eb',
              borderRadius: '999px',
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '17px',
              left: '12%',
              height: '5px',
              width: `${progressPercent * 0.76}%`,
              background: '#22c55e',
              borderRadius: '999px',
              zIndex: 2,
              transition: 'width 0.4s ease',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'grid',
              gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
              gap: '10px',
            }}
          >
            {steps.map((step, index) => {
              const completed = index <= activeStep;

              return (
                <div
                  key={step}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      background: completed ? '#22c55e' : '#e5e7eb',
                      color: completed ? '#fff' : '#777',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      boxShadow: completed
                        ? '0 6px 16px rgba(34, 197, 94, 0.3)'
                        : 'none',
                    }}
                  >
                    {completed ? '✓' : index + 1}
                  </div>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: completed ? '#16a34a' : '#777',
                    }}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {order.orderStatus === 'Cancelled' && (
          <div
            style={{
              marginTop: '30px',
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
              marginTop: '30px',
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
          {(order.cartItems || []).map((item, index) => (
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

              <strong>₹{Number(item.price || 0) * Number(item.quantity || 0)}</strong>
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

        <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
          {order.address || 'Address not available'}
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;