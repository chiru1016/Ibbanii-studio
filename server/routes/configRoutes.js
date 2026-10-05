const express = require('express');
const router = express.Router();

// Expose only the PUBLIC Razorpay key ID to the frontend (never the secret)
router.get('/razorpay-key', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
