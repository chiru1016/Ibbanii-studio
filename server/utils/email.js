const nodemailer = require('nodemailer');

const sendOrderNotification = async (order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL,
    subject: `New Order Received - Order ID: ${order._id}`,
    html: `
      <h2>New Order Details</h2>
      <p><strong>Customer Name:</strong> ${order.customerName}</p>
      <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <hr />
      <h3>Ordered Products:</h3>
      <ul>
        ${order.cartItems.map(item => `
          <li>${item.name} x ${item.quantity} - ₹${item.price} (each)</li>
        `).join('')}
      </ul>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <hr />
      <p><strong>Razorpay Order ID:</strong> ${order.razorpayOrderId}</p>
      <p><strong>Razorpay Payment ID:</strong> ${order.razorpayPaymentId}</p>
      <p><strong>Order Status:</strong> ${order.orderStatus}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent to owner.');
  } catch (error) {
    console.error('Error sending order notification email:', error);
  }
};

module.exports = { sendOrderNotification };
