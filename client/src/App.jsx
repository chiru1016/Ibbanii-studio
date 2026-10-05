import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentStatus from './pages/PaymentStatus';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';

import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Navbar />

            <main style={{ flex: 1, paddingTop: '80px' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth" element={<Auth />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/payment-status"
                  element={
                    <ProtectedRoute>
                      <PaymentStatus />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderTracking />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/add-product"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <ManageProducts />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <ManageOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;