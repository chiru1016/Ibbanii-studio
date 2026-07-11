import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      height: '80px',
      backgroundColor: 'rgba(255, 249, 251, 0.85)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 2px 10px rgba(216, 77, 103, 0.05)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
    }}>
      <Link to="/" style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '22px',
        fontWeight: '700',
        letterSpacing: '2px',
        color: 'var(--primary)',
      }}>
        THE FLORELLE STUDIO
      </Link>

      <div className="nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <Link to="/products" style={{ fontWeight: 500 }}>Shop</Link>

        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Admin</Link>
        )}

        {/* Wishlist icon — only when logged in */}
        {user && (
          <Link to="/wishlist" style={{ position: 'relative' }} title="My Wishlist">
            <Heart size={24} style={{ transition: 'all 0.2s' }} />
            {wishlistItems.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px', right: '-8px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontSize: '10px',
                width: '18px', height: '18px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}>
                {wishlistItems.length}
              </span>
            )}
          </Link>
        )}

        {/* Cart icon */}
        <Link to="/cart" style={{ position: 'relative' }} title="Cart">
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px', right: '-8px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontSize: '10px',
              width: '18px', height: '18px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700,
            }}>
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link to="/profile" title="My Profile"><User size={24} /></Link>
            <button
              onClick={logout}
              title="Logout"
              style={{ background: 'none', color: 'var(--text)' }}
            >
              <LogOut size={24} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '20px' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
