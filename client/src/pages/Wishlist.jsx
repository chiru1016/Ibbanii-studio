import React, { useContext } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems } = useContext(WishlistContext);

  if (wishlistItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          backgroundColor: 'var(--secondary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
        }}>
          <Heart size={48} color="var(--primary)" />
        </div>
        <h2 style={{ marginBottom: '12px' }}>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '32px', maxWidth: '380px', margin: '0 auto 32px' }}>
          Save your favourite handmade pieces here and come back to them whenever you're ready.
        </p>
        <Link to="/products" className="btn-primary">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          backgroundColor: 'var(--secondary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Heart size={24} color="var(--primary)" fill="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', lineHeight: 1 }}>My Wishlist</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '4px' }}>
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '30px',
      }}>
        {wishlistItems.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} className="btn-secondary">
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
