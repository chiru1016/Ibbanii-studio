import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--text)', color: 'white', padding: '60px 5% 20px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '20px', fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}>THE FLORELLE STUDIO</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Crafting joy one stitch at a time. High quality handmade flowers, dolls, and home decor.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', color: '#aaa', fontSize: '0.9rem', lineHeight: '2' }}>
            <li>Shop All</li>
            <li>New Arrivals</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>Customer Service</h4>
          <ul style={{ listStyle: 'none', color: '#aaa', fontSize: '0.9rem', lineHeight: '2' }}>
            <li>Shipping Policy</li>
            <li>Returns & Exchanges</li>
            <li>FAQ</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>Connect</h4>
          <ul style={{ listStyle: 'none', color: '#aaa', fontSize: '0.9rem', lineHeight: '2' }}>
            <li><a href="https://instagram.com/the_ibbanii.studio" target="_blank" rel="noopener noreferrer" style={{ hover: { color: 'var(--primary)' } }}>📸 @the_ibbanii.studio</a></li>
            <li>Facebook</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', borderTop: '1px solid #444', paddingTop: '20px', color: '#777', fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} THE FLORELLE STUDIO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
