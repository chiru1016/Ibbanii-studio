import React, { useState, useContext } from 'react';
import axios from 'axios';
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
    if (!address) return alert('Please enter your address');
    
    setLoading(true);
    try {
      // 1. Create Razorpay Order on server
      const { data: order } = await axios.post('http://localhost:5000/api/orders/razorpay', { amount: totalAmount });

      // 2. Fetch Razorpay public key ID from backend (never hardcode it in frontend)
      const { data: config } = await axios.get('http://localhost:5000/api/config/razorpay-key');

      // 3. Open Razorpay Checkout
      const options = {
        key: config.keyId,
        amount: order.amount,
        currency: 'INR',
        name: 'The Florelle Studio',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            // 4. Verify Payment and Save Order
            await axios.post('http://localhost:5000/api/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const finalOrder = {
              customerName: user.name,
              email: user.email,
              phone: user.phone,
              address,
              cartItems,
              totalAmount,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id
            };

            await axios.post('http://localhost:5000/api/orders', finalOrder);
            clearCart();
            navigate('/payment-status?status=success');
          } catch (err) {
            console.error(err);
            navigate('/payment-status?status=failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: { color: '#D84D67' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert('Error creating payment order');
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
            <input type="text" readOnly value={user?.name} style={{ background: '#f9f9f9' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" readOnly value={user?.email} style={{ background: '#f9f9f9' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Phone</label>
              <input type="text" readOnly value={user?.phone} style={{ background: '#f9f9f9' }} />
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
            ></textarea>
          </div>
        </div>

        <div className="card" style={{ padding: '25px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px' }}>Order Total</h3>
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
