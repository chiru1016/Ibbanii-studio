import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    identifier: '' // For login: email or phone
  });
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
          password: formData.password 
        };

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {error && <p style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email or Phone Number</label>
              <input 
                type="text" 
                name="identifier" 
                required 
                placeholder="Enter email or phone"
                value={formData.identifier} 
                onChange={handleInputChange} 
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '20px' }}>* At least email or phone number is required.</p>
            </>
          )}

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleInputChange} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '20px' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, padding: 0 }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
