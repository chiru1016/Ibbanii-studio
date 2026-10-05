import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'cart';

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }

    return parsedCart;
  } catch (error) {
    console.error('Invalid cart data. Clearing cart.', error);
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product || !product._id) return;

    setCartItems((prevItems) => {
      const itemExists = prevItems.find(
        (item) => item.productId === product._id
      );

      if (itemExists) {
        return prevItems.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + 1,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};