import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]); // full product objects
  const [wishlistIds, setWishlistIds] = useState(new Set()); // for fast lookups

  // Fetch wishlist from server whenever the user logs in/out
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistIds(new Set());
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/wishlist');
      setWishlistItems(res.data);
      setWishlistIds(new Set(res.data.map(p => p._id)));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  const toggleWishlist = async (product) => {
    if (!user) return; // caller should redirect to auth

    try {
      if (isWishlisted(product._id)) {
        // Remove
        const res = await api.delete(`/api/wishlist/${product._id}`);
        setWishlistItems(res.data);
        setWishlistIds(new Set(res.data.map(p => p._id)));
      } else {
        // Add
        const res = await api.post(`/api/wishlist/${product._id}`);
        setWishlistItems(res.data);
        setWishlistIds(new Set(res.data.map(p => p._id)));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistIds, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
