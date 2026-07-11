const User = require('../models/User');
const jwt = require('jsonwebtoken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

const makeToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const register = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();

    if (!name || name.length < 2) {
      return res.status(400).send({ error: 'Valid name is required.' });
    }

    if (!email && !phone) {
      return res.status(400).send({ error: 'Email or phone is required for registration.' });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).send({ error: 'Invalid email address.' });
    }

    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).send({ error: 'Invalid Indian phone number.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).send({ error: 'Password must be at least 6 characters.' });
    }

    const user = new User({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password,
      role: 'customer',
    });

    await user.save();

    const token = makeToken(user);

    res.status(201).send({
      user: user.toSafeUser(),
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).send({ error: `That ${field} is already registered. Try logging in.` });
    }

    res.status(500).send({ error: 'Server error. Please try again in a moment.' });
  }
};

const login = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    identifier = identifier?.trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).send({ error: 'Email/phone and password are required.' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
      ],
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid login credentials.' });
    }

    const token = makeToken(user);

    res.send({
      user: user.toSafeUser(),
      token,
    });
  } catch (error) {
    res.status(500).send({ error: 'Server error. Please try again in a moment.' });
  }
};

const getProfile = async (req, res) => {
  res.send(req.user.toSafeUser());
};

module.exports = { register, login, getProfile };