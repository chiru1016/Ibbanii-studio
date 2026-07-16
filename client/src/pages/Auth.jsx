import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react';

import {
  firebaseAuth,
  googleProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
} from '../firebase';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizePhone = (phone) => {
  if (!phone) return '';

  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
};

const isValidIndianPhone = (phone) => {
  const cleaned = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
};

const isEmail = (value) => value.includes('@');

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
  const [successInfo, setSuccessInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const goAfterLogin = (user) => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (e) => {
    setError('');
    setSuccessInfo('');

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateLogin = () => {
    const identifier = formData.identifier.trim();

    if (!identifier) {
      return 'Please enter your email or phone number.';
    }

    if (isEmail(identifier)) {
      if (!emailRegex.test(identifier)) {
        return 'Please enter a valid email address.';
      }
    } else if (!isValidIndianPhone(identifier)) {
      return 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!formData.password) {
      return 'Please enter your password.';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    return null;
  };

  const validateRegister = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name || name.length < 2) {
      return 'Please enter your full name.';
    }

    if (!email && !phone) {
      return 'Please enter either email or phone number.';
    }

    if (email && !emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (phone && !isValidIndianPhone(phone)) {
      return 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!formData.password) {
      return 'Please create a password.';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessInfo('');

    const validationError = isLogin ? validateLogin() : validateRegister();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    let payload;

    if (isLogin) {
      const identifier = formData.identifier.trim();

      payload = {
        identifier: isEmail(identifier)
          ? identifier.toLowerCase()
          : normalizePhone(identifier),
        password: formData.password,
      };
    } else {
      payload = {
        name: formData.name.trim(),
        email: formData.email.trim()
          ? formData.email.trim().toLowerCase()
          : undefined,
        phone: formData.phone.trim()
          ? normalizePhone(formData.phone.trim())
          : undefined,
        password: formData.password,
      };
    }

    try {
      const res = await api.post(endpoint, payload);

      login(res.data.user, res.data.token);
      goAfterLogin(res.data.user);
    } catch (err) {
      console.error('Auth error:', err);

      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            'Login failed. Please check your details.'
        );
      } else {
        setError('Unable to login right now. Please try again after a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithFirebaseToken = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();

    const res = await api.post('/api/auth/firebase-login', {
      idToken,
    });

    login(res.data.user, res.data.token);
    goAfterLogin(res.data.user);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccessInfo('');
      setLoading(true);

      const result = await signInWithPopup(firebaseAuth, googleProvider);

      await loginWithFirebaseToken(result.user);
    } catch (err) {
      console.error('Google login error:', err);

      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            'Google login failed. Please try again.'
        );
      } else {
        setError('Google login failed. Please try again after a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.error('Recaptcha clear error:', error);
      }

      window.recaptchaVerifier = null;
    }
  };

  const sendPhoneOtp = async () => {
    try {
      setError('');
      setSuccessInfo('');
      setOtpLoading(true);

      const cleanedPhone = normalizePhone(otpPhone);

      if (!isValidIndianPhone(cleanedPhone)) {
        setError('Enter a valid 10-digit Indian phone number.');
        return;
      }

      resetRecaptcha();

      window.recaptchaVerifier = new RecaptchaVerifier(
        firebaseAuth,
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );

      const confirmation = await signInWithPhoneNumber(
        firebaseAuth,
        `+91${cleanedPhone}`,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setSuccessInfo('OTP sent successfully. Please check your phone.');
    } catch (err) {
      console.error('OTP send error:', err);

      setError('Failed to send OTP. Please try again after a moment.');
      resetRecaptcha();
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      setError('');
      setSuccessInfo('');
      setOtpLoading(true);

      if (!confirmationResult) {
        setError('Please send OTP first.');
        return;
      }

      if (!otpCode || otpCode.length < 6) {
        setError('Enter valid 6-digit OTP.');
        return;
      }

      const result = await confirmationResult.confirm(otpCode);

      await loginWithFirebaseToken(result.user);
    } catch (err) {
      console.error('OTP verify error:', err);

      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            'OTP verification failed. Please try again.'
        );
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessInfo('');
    setShowPassword(false);
    setConfirmationResult(null);
    setOtpPhone('');
    setOtpCode('');

    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      identifier: '',
    });
  };

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '44px 40px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <p style={{ color: 'var(--text-light)', fontSize: '0.92rem' }}>
            {isLogin
              ? 'Login using password, Google, or phone OTP'
              : 'Register with email or phone number'}
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '22px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              lineHeight: '1.6',
            }}
          >
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '22px',
              fontSize: '0.9rem',
              lineHeight: '1.6',
            }}
          >
            {successInfo}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}
              >
                Full Name
              </label>

              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                  }}
                />

                <input
                  type="text"
                  name="name"
                  required={!isLogin}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          )}

          {isLogin ? (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}
              >
                Email or Phone Number
              </label>

              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                  }}
                />

                <input
                  type="text"
                  name="identifier"
                  required={isLogin}
                  placeholder="Email or 10-digit phone number"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  autoComplete="username"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  Email Address
                </label>

                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999',
                    }}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  Phone Number
                </label>

                <div style={{ position: 'relative' }}>
                  <Phone
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999',
                    }}
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#888',
                  marginBottom: '18px',
                }}
              >
                Enter at least one: email or phone number.
              </p>
            </>
          )}

          <div style={{ marginBottom: '26px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                }}
              />

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder={isLogin ? 'Enter password' : 'Minimum 6 characters'}
                value={formData.password}
                onChange={handleInputChange}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={6}
                style={{
                  paddingLeft: '44px',
                  paddingRight: '48px',
                }}
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
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              marginBottom: '18px',
            }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '18px 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
              <span style={{ fontSize: '0.8rem', color: '#888' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '30px',
                border: '1px solid #ddd',
                background: '#fff',
                color: '#333',
                marginBottom: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              Continue with Google
            </button>

            <div id="recaptcha-container"></div>

            <div
              style={{
                border: '1px solid #eee',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px',
                background: '#fff',
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: '12px' }}>
                Login with Phone OTP
              </p>

              <input
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={otpPhone}
                onChange={(e) => {
                  setError('');
                  setSuccessInfo('');
                  setOtpPhone(e.target.value);
                }}
                style={{ marginBottom: '10px' }}
              />

              <button
                type="button"
                onClick={sendPhoneOtp}
                className="btn-secondary"
                style={{
                  width: '100%',
                  marginBottom: '12px',
                }}
                disabled={otpLoading}
              >
                {otpLoading ? 'Please wait...' : 'Send OTP'}
              </button>

              {confirmationResult && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpCode}
                    onChange={(e) => {
                      setError('');
                      setSuccessInfo('');
                      setOtpCode(e.target.value);
                    }}
                    style={{ marginBottom: '10px' }}
                  />

                  <button
                    type="button"
                    onClick={verifyPhoneOtp}
                    className="btn-primary"
                    style={{ width: '100%' }}
                    disabled={otpLoading}
                  >
                    {otpLoading ? 'Verifying...' : 'Verify OTP & Login'}
                  </button>
                </>
              )}
            </div>
          </>
        )}

        <p
          style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '0.9rem',
          }}
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}

          <button
            type="button"
            onClick={switchMode}
            style={{
              background: 'none',
              color: 'var(--primary)',
              fontWeight: 600,
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Register here' : 'Login'}
          </button>
        </p>

        {isLogin && (
          <div
            style={{
              marginTop: '24px',
              padding: '14px 18px',
              background: 'rgba(216, 77, 103, 0.06)',
              borderRadius: '10px',
              borderLeft: '3px solid var(--primary)',
              fontSize: '0.82rem',
              color: 'var(--text-light)',
            }}
          >
            <strong style={{ color: 'var(--primary-dark)' }}>
              Admin access?
            </strong>{' '}
            Use your admin email and password on this same page.
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;