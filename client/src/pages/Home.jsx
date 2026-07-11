import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Gift } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text animate-fade-in">
            <span className="badge">Handmade with Love</span>
            <h2>Flowers That <br /><span className="accent">Never Fade</span></h2>
            <p>Experience the everlasting beauty of handcrafted pipe cleaner flowers and woolen dolls. Perfect for gifts, home decor, and special moments that deserve to bloom forever.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn-primary">View Collection</Link>
              <Link to="/products?category=Dolls" className="btn-secondary">Shop Dolls</Link>
            </div>
          </div>
          <div className="hero-image animate-float">
            <img src="/assets/roses.png" alt="Handmade Rose Bouquet" />
            <div className="floating-card c1"><span>100% Homemade</span></div>
            <div className="floating-card c2"><span>Customizable</span></div>
          </div>
        </div>
        <div className="hero-bg-shapes">
          <div className="shape s1"></div>
          <div className="shape s2"></div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--secondary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Heart color="var(--primary)" />
            </div>
            <h3>100% Handmade</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Every product is crafted by hand with attention to detail and care.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--secondary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles color="var(--primary)" />
            </div>
            <h3>Unique Designs</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>No two items are exactly the same. Own something truly special.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--secondary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Gift color="var(--primary)" />
            </div>
            <h3>Perfect Gifting</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Thoughtful, everlasting gifts for your loved ones, packed with extra care.</p>
          </div>
        </div>
      </section>

      {/* Featured Doll Banner */}
      <section style={{ 
        padding: '60px 0', 
        backgroundColor: 'rgba(255, 209, 220, 0.15)', 
        margin: '40px 0 80px',
        borderTop: '1px solid rgba(255, 209, 220, 0.3)',
        borderBottom: '1px solid rgba(255, 209, 220, 0.3)'
      }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '50px',
          alignItems: 'center'
        }}>
          <div>
            <img 
              src="/assets/woolen_doll.png" 
              alt="Handmade Woolen Doll" 
              style={{ 
                borderRadius: '30px', 
                boxShadow: '0 15px 40px rgba(216, 77, 103, 0.15)',
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover'
              }} 
            />
          </div>
          <div>
            <span style={{ 
              color: 'var(--primary)', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              fontSize: '0.8rem',
              letterSpacing: '2px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>New Collection</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text)' }}>
              Adorable Woolen Dolls
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '30px', lineHeight: '1.8' }}>
              Discover our new collection of cute, handcrafted crocheted woolen dolls. Meticulously made using premium soft yarn, they make perfect gifts, nursery companions, or lovely home decor.
            </p>
            <Link to="/products?category=Dolls" className="btn-primary">Browse Woolen Dolls</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
