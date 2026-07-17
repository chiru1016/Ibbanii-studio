import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!address || address.trim().length < 10) {
      alert('Please enter your complete delivery address.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay checkout script not loaded. Check client/index.html.');
      return;
    }

    setLoading(true);

    try {
      const { data: order } = await api.post('/api/orders/razorpay', {
        cartItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        address,
      });

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Ibbanii Studio',
        description: 'Order Payment',
        order_id: order.razorpayOrderId,

        handler: async (response) => {
          try {
            const verifyRes = await api.post('/api/orders/verify', {
            appOrderId: order.appOrderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          clearCart();
          localStorage.removeItem('cart');

          const paidOrderId = verifyRes.data?.order?._id || order.appOrderId;

          navigate(`/orders/${paidOrderId}`, { replace: true });
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Payment verification failed.');
            navigate('/payment-status?status=failed');
          }
        },

        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },

        theme: {
          color: '#D84D67',
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error(response.error);
        alert(response.error.description || 'Payment failed.');
        navigate('/payment-status?status=failed');
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error creating payment order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '40px' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        <div className="card" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Shipping Information</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              style={{ background: '#f9f9f9' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                style={{ background: '#f9f9f9' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Phone</label>
              <input
                type="text"
                readOnly
                value={user?.phone || ''}
                style={{ background: '#f9f9f9' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Delivery Address</label>
            <textarea
              rows="4"
              placeholder="House No, Street, Landmark, City, State, PIN"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="card" style={{ padding: '25px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px' }}>Order Total</h3>

          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
            Final amount will be calculated securely on the server.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 700, fontSize: '1.5rem' }}>
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={handlePayment}
            className="btn-primary"
            style={{ width: '100%', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
