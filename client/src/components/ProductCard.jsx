import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';

import api from '../api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import { getImageUrl } from '../utils/image';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [ratingData, setRatingData] = useState({
    avgRating: 0,
    count: 0,
  });

  const wishlisted = product?._id ? isWishlisted(product._id) : false;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (!product?._id) return;

        const res = await api.get(`/api/products/${product._id}/reviews`);

        setRatingData({
          avgRating: res.data?.avgRating || 0,
          count: res.data?.count || 0,
        });
      } catch (error) {
        console.error('Rating fetch error:', error);
        setRatingData({
          avgRating: 0,
          count: 0,
        });
      }
    };

    fetchRating();
  }, [product?._id]);

  const handleWishlist = (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/auth');
      return;
    }

    toggleWishlist(product);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  if (!product) {
    return null;
  }

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={handleWishlist}
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          border: 'none',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Heart
          size={18}
          color="var(--primary)"
          fill={wishlisted ? 'var(--primary)' : 'none'}
          style={{ transition: 'fill 0.2s' }}
        />
      </button>

      <Link to={`/products/${product._id}`}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name || 'Product image'}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
          }}
        />
      </Link>

      <div
        style={{
          padding: '20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            color: 'var(--primary-dark)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {product.category || 'Handmade'}
        </span>

        <h3
          style={{
            margin: '6px 0 4px',
            fontSize: '1.1rem',
          }}
        >
          {product.name}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
          }}
        >
          <StarRating rating={ratingData.avgRating} size={14} />

          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-light)',
            }}
          >
            {ratingData.count > 0 ? `(${ratingData.count})` : 'No reviews yet'}
          </span>
        </div>

        <p
          style={{
            color: 'var(--text-light)',
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '20px',
          }}
        >
          ₹{product.price}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: 'auto',
          }}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>

          <Link
            to={`/products/${product._id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              color: 'var(--text-light)',
            }}
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
