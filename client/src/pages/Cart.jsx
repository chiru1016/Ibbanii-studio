import React, { useContext } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <ShoppingBag size={80} style={{ color: '#ddd', marginBottom: '20px' }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '40px' }}>Your Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.map((item) => (
            <div key={item.productId} className="card" style={{ display: 'flex', padding: '15px', alignItems: 'center', gap: '20px' }}>
              <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{item.price}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f4f4f4', padding: '5px 10px', borderRadius: '25px' }}>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ background: 'none' }}><Minus size={16} /></button>
                  <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ background: 'none' }}><Plus size={16} /></button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--error)', background: 'none' }}><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '25px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Shipping</span>
            <span style={{ color: 'var(--success)' }}>Free</span>
          </div>
          <hr style={{ margin: '20px 0', borderColor: '#eee' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 700, fontSize: '1.3rem' }}>
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <Link to="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '1.1rem' }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
