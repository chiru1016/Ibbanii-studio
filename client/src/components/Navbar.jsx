import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Heart, Menu, X } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        IBBANII STUDIO
      </Link>

      <button
        className="navbar-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/products" onClick={closeMenu}>
          Shop
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-link" onClick={closeMenu}>
            Admin
          </Link>
        )}

        {user && (
          <Link to="/wishlist" className="navbar-icon-link" onClick={closeMenu}>
            <Heart size={24} />
            <span>Wishlist</span>

            {wishlistItems.length > 0 && (
              <small className="nav-count">{wishlistItems.length}</small>
            )}
          </Link>
        )}

        <Link to="/cart" className="navbar-icon-link" onClick={closeMenu}>
          <ShoppingCart size={24} />
          <span>Cart</span>

          {cartCount > 0 && (
            <small className="nav-count">{cartCount}</small>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="navbar-icon-link" onClick={closeMenu}>
              <User size={24} />
              <span>Profile</span>
            </Link>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={24} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn-primary nav-login-btn" onClick={closeMenu}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
