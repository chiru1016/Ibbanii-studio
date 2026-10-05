import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error fetching orders');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}`, {
        orderStatus: status,
      });

      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating status');
    }
  };

  const getShortOrderId = (id) => {
    if (!id) return 'N/A';
    return id.substring(id.length - 10).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN');
  };

  const getCustomerName = (order) => {
    return order.customerName || order.userId?.name || 'N/A';
  };

  const getCustomerEmail = (order) => {
    return order.email || order.userId?.email || 'N/A';
  };

  const getStatusStyle = (status) => {
    if (status === 'Delivered') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534',
      };
    }

    if (status === 'Cancelled') {
      return {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
      };
    }

    if (status === 'Shipped') {
      return {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
      };
    }

    return {
      backgroundColor: '#fef9c3',
      color: '#854d0e',
    };
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '40px' }}>Manage Orders</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <h3>No orders found</h3>
          <p>Customer orders will appear here after successful payment.</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
                <th style={{ padding: '15px' }}>Order ID</th>
                <th style={{ padding: '15px' }}>Customer</th>
                <th style={{ padding: '15px' }}>Phone</th>
                <th style={{ padding: '15px' }}>Total</th>
                <th style={{ padding: '15px' }}>Payment</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px' }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 600 }}>
                      {getShortOrderId(order._id)}
                    </td>

                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 600 }}>{getCustomerName(order)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {getCustomerEmail(order)}
                      </div>
                    </td>

                    <td style={{ padding: '15px' }}>
                      {order.phone || order.userId?.phone || 'N/A'}
                    </td>

                    <td style={{ padding: '15px', fontWeight: 600 }}>
                      ₹{order.totalAmount}
                    </td>

                    <td style={{ padding: '15px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          backgroundColor:
                            order.paymentStatus === 'Paid' ? '#dcfce7' : '#fee2e2',
                          color:
                            order.paymentStatus === 'Paid' ? '#166534' : '#991b1b',
                        }}
                      >
                        {order.paymentStatus || 'N/A'}
                      </span>
                    </td>

                    <td style={{ padding: '15px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          ...getStatusStyle(order.orderStatus),
                        }}
                      >
                        {order.orderStatus || 'N/A'}
                      </span>
                    </td>

                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                          value={order.orderStatus || 'Pending'}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          style={{
                            padding: '6px',
                            fontSize: '0.85rem',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order._id ? null : order._id
                            )
                          }
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#222',
                            color: '#fff',
                          }}
                        >
                          {expandedOrder === order._id ? 'Hide' : 'View'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="7" style={{ padding: '0' }}>
                        <div
                          style={{
                            padding: '25px',
                            backgroundColor: '#fff7fa',
                            borderBottom: '1px solid #eee',
                          }}
                        >
                          <h3 style={{ marginBottom: '20px' }}>Order Details</h3>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '25px',
                              marginBottom: '25px',
                            }}
                          >
                            <div>
                              <h4 style={{ marginBottom: '10px' }}>Customer Details</h4>

                              <p>
                                <strong>Name:</strong> {getCustomerName(order)}
                              </p>

                              <p>
                                <strong>Email:</strong> {getCustomerEmail(order)}
                              </p>

                              <p>
                                <strong>Phone:</strong>{' '}
                                {order.phone || order.userId?.phone || 'N/A'}
                              </p>

                              <p>
                                <strong>Address:</strong>
                              </p>

                              <div
                                style={{
                                  backgroundColor: '#fff',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  border: '1px solid #eee',
                                  lineHeight: '1.6',
                                }}
                              >
                                {order.address || 'Address not available'}
                              </div>
                            </div>

                            <div>
                              <h4 style={{ marginBottom: '10px' }}>Payment Details</h4>

                              <p>
                                <strong>Total Amount:</strong> ₹{order.totalAmount}
                              </p>

                              <p>
                                <strong>Payment Status:</strong>{' '}
                                {order.paymentStatus || 'N/A'}
                              </p>

                              <p>
                                <strong>Order Status:</strong>{' '}
                                {order.orderStatus || 'N/A'}
                              </p>

                              <p>
                                <strong>Razorpay Order ID:</strong>{' '}
                                {order.razorpayOrderId || 'N/A'}
                              </p>

                              <p>
                                <strong>Razorpay Payment ID:</strong>{' '}
                                {order.razorpayPaymentId || 'N/A'}
                              </p>

                              <p>
                                <strong>Order Date:</strong> {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <h4 style={{ marginBottom: '10px' }}>Products Ordered</h4>

                          <div style={{ overflowX: 'auto' }}>
                            <table
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                overflow: 'hidden',
                              }}
                            >
                              <thead>
                                <tr style={{ backgroundColor: '#f8d7e2' }}>
                                  <th style={{ padding: '12px', textAlign: 'left' }}>
                                    Product
                                  </th>
                                  <th style={{ padding: '12px', textAlign: 'left' }}>
                                    Price
                                  </th>
                                  <th style={{ padding: '12px', textAlign: 'left' }}>
                                    Quantity
                                  </th>
                                  <th style={{ padding: '12px', textAlign: 'left' }}>
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {order.cartItems && order.cartItems.length > 0 ? (
                                  order.cartItems.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                      <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                          {item.image && (
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '6px',
                                              }}
                                            />
                                          )}
                                          <span>{item.name}</span>
                                        </div>
                                      </td>

                                      <td style={{ padding: '12px' }}>₹{item.price}</td>

                                      <td style={{ padding: '12px' }}>{item.quantity}</td>

                                      <td style={{ padding: '12px', fontWeight: 600 }}>
                                        ₹{item.price * item.quantity}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4" style={{ padding: '12px' }}>
                                      No product details available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;