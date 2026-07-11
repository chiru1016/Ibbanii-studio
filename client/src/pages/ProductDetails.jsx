import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { getImageUrl } from '../utils/image';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Heart, Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myReview, setMyReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const { addToCart } = useContext(CartContext);
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const wishlisted = product ? isWishlisted(product._id) : false;

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/products/${id}/reviews`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setReviewCount(res.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = () => {
    if (!user) { navigate('/auth'); return; }
    toggleWishlist(product);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!myReview.rating) { setReviewError('Please select a star rating.'); return; }
    setSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      await api.post(`/api/products/${id}/reviews`, myReview);
      setReviewSuccess('Your review has been submitted!');
      setMyReview({ rating: 0, comment: '' });
      fetchReviews(); // refresh the list
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/api/products/${id}/reviews/${reviewId}`);
      fetchReviews();
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Product not found.</div>;

  const userExistingReview = user ? reviews.find(r => r.userId?._id === user._id || r.userId === user._id) : null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--text-light)' }}>
        <ArrowLeft size={20} /> Back to Products
      </Link>

      {/* ── Product Info ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', marginBottom: '70px' }}>
        {/* Image */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Details */}
        <div>
          <span style={{ color: 'var(--primary-dark)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2.2rem', margin: '12px 0 8px' }}>{product.name}</h1>

          {/* Average rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <StarRating rating={avgRating} size={22} showValue={reviewCount > 0} />
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews yet'}
            </span>
          </div>

          <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '25px' }}>₹{product.price}</p>

          <div style={{ paddingBottom: '28px', borderBottom: '1px solid #eee', marginBottom: '28px' }}>
            <h4 style={{ marginBottom: '10px' }}>Description</h4>
            <p style={{ color: '#666', lineHeight: '1.8' }}>{product.description}</p>
          </div>

          {/* Buttons row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
            <button
              onClick={() => addToCart(product)}
              className="btn-primary"
              style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              style={{
                padding: '14px 18px',
                border: `2px solid ${wishlisted ? 'var(--primary)' : '#ddd'}`,
                borderRadius: '8px',
                background: wishlisted ? 'var(--secondary)' : 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s',
              }}
            >
              <Heart
                size={22}
                color="var(--primary)"
                fill={wishlisted ? 'var(--primary)' : 'none'}
                style={{ transition: 'fill 0.2s' }}
              />
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { Icon: ShieldCheck, label: 'Secure Payment' },
              { Icon: Truck, label: 'Fast Shipping' },
              { Icon: RefreshCw, label: 'Easy Returns' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{ textAlign: 'center', padding: '14px 8px', background: 'var(--secondary)', borderRadius: '12px' }}>
                <Icon size={24} style={{ margin: '0 auto 8px', color: 'var(--primary)', display: 'block' }} />
                <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div style={{ borderTop: '2px solid var(--secondary)', paddingTop: '50px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Customer Reviews</h2>

        {/* Summary bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
              {avgRating > 0 ? avgRating.toFixed(1) : '—'}
            </div>
            <StarRating rating={avgRating} size={20} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
              {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Write a review — only shown when logged in and hasn't reviewed yet */}
        {user && !userExistingReview && (
          <div className="card" style={{ padding: '30px', marginBottom: '40px', background: 'var(--background)' }}>
            <h3 style={{ marginBottom: '20px' }}>Write a Review</h3>
            {reviewError && (
              <p style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                {reviewError}
              </p>
            )}
            {reviewSuccess && (
              <p style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                {reviewSuccess}
              </p>
            )}
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Rating</label>
                <StarRating
                  rating={myReview.rating}
                  interactive
                  onChange={(val) => setMyReview(r => ({ ...r, rating: val }))}
                  size={32}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Comment <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  rows="4"
                  placeholder="Share your experience with this product..."
                  value={myReview.comment}
                  onChange={(e) => setMyReview(r => ({ ...r, comment: e.target.value }))}
                  maxLength={500}
                />
                <p style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>
                  {myReview.comment.length}/500
                </p>
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ padding: '12px 32px' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Prompt to log in */}
        {!user && (
          <div style={{ padding: '20px 24px', background: 'var(--secondary)', borderRadius: '12px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontWeight: 500, color: 'var(--text)' }}>Have this product? Share your thoughts!</p>
            <Link to="/auth" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '20px' }}>Login to Review</Link>
          </div>
        )}

        {/* Existing review by current user — with update/delete option */}
        {userExistingReview && (
          <div className="card" style={{ padding: '24px', marginBottom: '40px', border: '2px solid var(--secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Your Review</p>
                <StarRating rating={userExistingReview.rating} size={18} />
              </div>
              <button
                onClick={() => handleDeleteReview(userExistingReview._id)}
                style={{ background: 'none', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
            {userExistingReview.comment && (
              <p style={{ color: '#555', lineHeight: '1.7' }}>{userExistingReview.comment}</p>
            )}
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
            <p style={{ fontSize: '1.1rem' }}>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews
              .filter(r => !(user && (r.userId?._id === user._id || r.userId === user._id))) // exclude own (shown above)
              .map((review) => {
                const initial = review.userId?.name?.charAt(0)?.toUpperCase() || '?';
                const name = review.userId?.name || 'Anonymous';
                const date = new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

                return (
                  <div key={review._id} className="card" style={{ padding: '22px 26px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      {/* Avatar */}
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        backgroundColor: 'var(--secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)',
                        flexShrink: 0,
                      }}>
                        {initial}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 700, marginRight: '10px' }}>{name}</span>
                            <StarRating rating={review.rating} size={15} />
                          </div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{date}</span>
                        </div>
                        {review.comment && (
                          <p style={{ marginTop: '10px', color: '#555', lineHeight: '1.7' }}>{review.comment}</p>
                        )}

                        {/* Admin delete button */}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            style={{ marginTop: '10px', background: 'none', color: 'var(--error)', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
