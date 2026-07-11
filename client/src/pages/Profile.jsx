import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, MapPin, Phone, Mail } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
        <aside>
          <div className="card" style={{ padding: '30px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
              {user?.name?.charAt(0)}
            </div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{user?.name}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666' }}>
                <Mail size={18} /> {user?.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666' }}>
                <Phone size={18} /> {user?.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666' }}>
                <Package size={18} /> Member since {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </aside>

        <main>
          <h2 style={{ marginBottom: '30px' }}>My Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <div key={order._id} className="card" style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#999' }}>ORDER ID: {order._id.substring(10).toUpperCase()}</p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        padding: '5px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        backgroundColor: order.orderStatus === 'Delivered' ? '#dcfce7' : '#fef9c3',
                        color: order.orderStatus === 'Delivered' ? '#166534' : '#854d0e'
                      }}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {order.cartItems.map((item, idx) => (
                      <img key={idx} src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <p style={{ color: '#666' }}>{order.cartItems.length} items</p>
                    <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Total: ₹{order.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
