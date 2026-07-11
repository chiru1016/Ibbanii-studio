import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    identifier: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { identifier: formData.identifier, password: formData.password }
      : {
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password,
        };

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', phone: '', password: '', identifier: '' });
    setShowPassword(false);
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '44px 40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            {isLogin ? 'Sign in to your Florelle Studio account' : 'Join The Florelle Studio family'}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '22px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}>
            <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            /* ── Login fields ── */
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Email or Phone Number
              </label>
              <input
                type="text"
                name="identifier"
                required
                placeholder="Enter your email or phone"
                value={formData.identifier}
                onChange={handleInputChange}
                autoComplete="username"
              />
            </div>
          ) : (
            /* ── Register fields ── */
            <>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '18px' }}>
                * At least one of email or phone is required.
              </p>
            </>
          )}

          {/* Password field with show/hide toggle */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 chars)'}
                value={formData.password}
                onChange={handleInputChange}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={isLogin ? undefined : 6}
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={switchMode}
            style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register here' : 'Login'}
          </button>
        </p>

        {/* Admin hint — visible on login screen only */}
        {isLogin && (
          <div style={{
            marginTop: '24px',
            padding: '14px 18px',
            background: 'rgba(216, 77, 103, 0.06)',
            borderRadius: '10px',
            borderLeft: '3px solid var(--primary)',
            fontSize: '0.82rem',
            color: 'var(--text-light)',
          }}>
            <strong style={{ color: 'var(--primary-dark)' }}>Admin access?</strong> Use your admin email and password on this same page. You'll be redirected to the Admin Dashboard automatically after login.
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
