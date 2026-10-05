const express = require('express');

const {
  register,
  login,
  firebaseLogin,
  getProfile,
} = require('../controllers/authController');

const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);

router.get('/profile', auth, getProfile);

module.exports = router;