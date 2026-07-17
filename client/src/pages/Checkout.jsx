import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [addressData, setAddressData] = useState({
    company: '',
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    area: '',
    addressLine: '',
    city: '',
    state: '',
    sameAsBilling: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryCharge = 100;
  const payableAmount = Number(totalAmount || 0) + deliveryCharge;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setError('');

    setAddressData({
      ...addressData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateAddress = () => {
    if (!addressData.name.trim()) return 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(addressData.phone.trim())) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    if (!/^\d{6}$/.test(addressData.pincode.trim())) {
      return 'Please enter a valid 6-digit pincode.';
    }
    if (!addressData.area.trim()) return 'Please enter your area/locality.';
    if (!addressData.addressLine.trim()) return 'Please enter full address.';
    if (!addressData.city.trim()) return 'Please enter city/district/town.';
    if (!addressData.state.trim()) return 'Please enter state.';

    return null;
  };

  const buildFullAddress = () => {
    return [
      addressData.company && `Company: ${addressData.company}`,
      `Name: ${addressData.name}`,
      `Phone: ${addressData.phone}`,
      `Address: ${addressData.addressLine}`,
      `Area: ${addressData.area}`,
      `City: ${addressData.city}`,
      `State: ${addressData.state}`,
      `Pincode: ${addressData.pincode}`,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const handlePayment = async () => {
    setError('');

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const validationError = validateAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);

      const fullAddress = buildFullAddress();

      const orderRes = await api.post('/api/orders/razorpay', {
        cartItems,
        address: fullAddress,
        shippingAddress: {
          company: addressData.company,
          name: addressData.name,
          phone: addressData.phone,
          pincode: addressData.pincode,
          area: addressData.area,
          addressLine: addressData.addressLine,
          city: addressData.city,
          state: addressData.state,
        },
        deliveryCharge,
        payableAmount,
      });

      const orderData = orderRes.data;

      const razorpayOrderId =
        orderData.razorpayOrderId ||
        orderData.razorpayOrder?.id ||
        orderData.id;

      const appOrderId =
        orderData.appOrderId ||
        orderData.order?._id ||
        orderData.order?.id;

      const amount =
        orderData.amount ||
        orderData.razorpayOrder?.amount ||
        payableAmount * 100;

      const key =
        orderData.key ||
        orderData.keyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayOrderId || !appOrderId) {
        setError('Order creation failed. Please try again.');
        return;
      }

      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'Ibbanii Studio',
        description: 'Handmade Craft Order',
        order_id: razorpayOrderId,

        prefill: {
          name: addressData.name,
          email: user?.email || '',
          contact: addressData.phone,
        },

        notes: {
          address: fullAddress,
        },

        theme: {
          color: '#d84d67',
        },

        handler: async function (response) {
          try {
            const verifyRes = await api.post('/api/orders/verify', {
              appOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            localStorage.removeItem('cart');

            const paidOrderId =
              verifyRes.data?.order?._id ||
              verifyRes.data?.order?.id ||
              appOrderId;

            navigate(`/orders/${paidOrderId}`, { replace: true });
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            setError('Payment verification failed. Please contact support.');
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Checkout error:', error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Unable to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <div className="card" style={{ padding: '35px', textAlign: 'center' }}>
          <h2>Your cart is empty</h2>
          <p style={{ margin: '12px 0 24px', color: 'var(--text-light)' }}>
            Add products before checkout.
          </p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        padding: '50px 20px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 0.9fr',
          gap: '30px',
          alignItems: 'start',
        }}
        className="checkout-layout"
      >
        <div className="card" style={{ padding: '34px' }}>
          <h1 style={{ marginBottom: '28px' }}>Add Shipping Address</h1>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                lineHeight: 1.6,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              name="company"
              placeholder="Company's Name (Optional)"
              value={addressData.company}
              onChange={handleChange}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={addressData.name}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={addressData.phone}
                onChange={handleChange}
                maxLength={10}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={addressData.pincode}
                onChange={handleChange}
                maxLength={6}
              />

              <input
                type="text"
                name="area"
                placeholder="Area / Locality"
                value={addressData.area}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="addressLine"
              placeholder="Address (House No, Building, Street)"
              value={addressData.addressLine}
              onChange={handleChange}
              rows={4}
              style={{
                resize: 'vertical',
                minHeight: '100px',
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <input
                type="text"
                name="city"
                placeholder="City / District / Town"
                value={addressData.city}
                onChange={handleChange}
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={addressData.state}
                onChange={handleChange}
              />
            </div>

            <label
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                color: 'var(--text-light)',
                fontSize: '0.95rem',
              }}
            >
              <input
                type="checkbox"
                name="sameAsBilling"
                checked={addressData.sameAsBilling}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              Same as Billing Address
            </label>

            <button
              type="button"
              className="btn-primary"
              onClick={handlePayment}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                marginTop: '10px',
              }}
            >
              {loading ? 'Processing...' : 'Save and Deliver Here'}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '28px',
              color: 'var(--text-light)',
              fontSize: '0.9rem',
            }}
          >
            <span>Cart</span>
            <span>--------</span>
            <strong style={{ color: '#22c55e' }}>Delivery</strong>
            <span>--------</span>
            <span>Payment</span>
          </div>

          <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
            {cartItems.map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '62px 1fr auto',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: '62px',
                    height: '62px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                />

                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>{item.name}</h4>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    Qty: {item.quantity}
                  </p>
                </div>

                <strong>₹{Number(item.price || 0) * Number(item.quantity || 0)}</strong>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Order Total</span>
              <strong>₹{totalAmount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Charges</span>
              <strong>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
              <strong>Total Payable</strong>
              <strong>₹{payableAmount}</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '24px',
            }}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .checkout-layout {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 600px) {
            .checkout-layout input,
            .checkout-layout textarea {
              font-size: 0.95rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Checkout;