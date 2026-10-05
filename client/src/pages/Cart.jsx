import React, { useContext } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/image';

const DELIVERY_CHARGE = 100;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } =
    useContext(CartContext);

  const deliveryCharge = cartItems.length > 0 ? DELIVERY_CHARGE : 0;
  const finalTotal = Number(totalAmount || 0) + deliveryCharge;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div
        className="container"
        style={{
          textAlign: 'center',
          padding: '100px 20px',
        }}
      >
        <ShoppingBag
          size={80}
          style={{
            color: '#ddd',
            marginBottom: '20px',
          }}
        />

        <h2>Your cart is empty</h2>

        <p
          style={{
            color: '#666',
            marginBottom: '30px',
          }}
        >
          Looks like you haven't added anything to your cart yet.
        </p>

        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '50px 20px' }}>
      <h1 style={{ marginBottom: '40px' }}>Your Cart</h1>

      <div
        className="cart-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="card"
              style={{
                display: 'flex',
                padding: '18px',
                alignItems: 'center',
                gap: '24px',
              }}
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                style={{
                  width: '110px',
                  height: '110px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                  {item.name}
                </h3>

                <p
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                  }}
                >
                  ₹{item.price}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f4f4f4',
                    padding: '6px 12px',
                    borderRadius: '25px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, Number(item.quantity) - 1)
                    }
                    disabled={Number(item.quantity) <= 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor:
                        Number(item.quantity) <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <span
                    style={{
                      fontWeight: 700,
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, Number(item.quantity) + 1)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  style={{
                    color: 'var(--error)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="card"
          style={{
            padding: '28px',
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
          }}
        >
          <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <span>Subtotal</span>
            <strong>₹{totalAmount}</strong>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <span>Shipping</span>
            <strong>₹{deliveryCharge}</strong>
          </div>

          <hr
            style={{
              margin: '22px 0',
              border: 'none',
              borderTop: '1px solid #eee',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '30px',
              fontWeight: 800,
              fontSize: '1.3rem',
            }}
          >
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>

          <Link
            to="/checkout"
            className="btn-primary"
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '1.1rem',
              padding: '14px',
            }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .cart-layout {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 650px) {
            .cart-layout .card {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Cart;