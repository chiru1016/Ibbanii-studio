const nodemailer = require('nodemailer');

const escapeHtml = (value = '') => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

const sendOrderNotification = async (order) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.OWNER_EMAIL) {
      console.warn('Email notification skipped: EMAIL_USER, EMAIL_PASS, or OWNER_EMAIL missing.');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemList = order.cartItems.map((item) => {
      return `
        <li>
          ${escapeHtml(item.name)} x ${item.quantity}
          - ₹${item.price} each
        </li>
      `;
    }).join('');

    await transporter.sendMail({
      from: `"Handmade Craft Store" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New Paid Order - ${order._id}`,
      html: `
        <h2>New Paid Order Received</h2>

        <p><strong>Customer Name:</strong> ${escapeHtml(order.customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(order.email || 'N/A')}</p>
        <p><strong>Phone:</strong> ${escapeHtml(order.phone || 'N/A')}</p>
        <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>

        <hr />

        <h3>Ordered Products</h3>
        <ul>${itemList}</ul>

        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

        <hr />

        <p><strong>Payment Status:</strong> ${escapeHtml(order.paymentStatus)}</p>
        <p><strong>Order Status:</strong> ${escapeHtml(order.orderStatus)}</p>
        <p><strong>Razorpay Order ID:</strong> ${escapeHtml(order.razorpayOrderId)}</p>
        <p><strong>Razorpay Payment ID:</strong> ${escapeHtml(order.razorpayPaymentId)}</p>
      `,
    });

    console.log('Order notification email sent to owner.');
  } catch (error) {
    console.error('Error sending order notification email:', error.message);
  }
};

module.exports = { sendOrderNotification };