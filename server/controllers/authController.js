const User = require('../models/User');
const jwt = require('jsonwebtoken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizePhone = (phone) => {
  if (!phone) return '';

  let cleaned = String(phone).replace(/\D/g, '');

  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
};

const isValidIndianPhone = (phone) => {
  const cleaned = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
};

const makeToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

const register = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone ? normalizePhone(phone) : undefined;

    if (!name || name.length < 2) {
      return res.status(400).send({
        error: 'Please enter your full name.',
      });
    }

    if (!email && !phone) {
      return res.status(400).send({
        error: 'Email or phone number is required.',
      });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).send({
        error: 'Invalid email address.',
      });
    }

    if (phone && !isValidIndianPhone(phone)) {
      return res.status(400).send({
        error: 'Invalid phone number. Enter a valid 10-digit Indian mobile number.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).send({
        error: 'Password must be at least 6 characters.',
      });
    }

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).send({
        error: 'Account already exists with this email or phone number.',
      });
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
      return res.status(400).send({
        error: 'Email or phone number is already registered.',
      });
    }

    res.status(500).send({
      error: 'Server error. Please try again.',
    });
  }
};

const login = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    identifier = identifier?.trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).send({
        error: 'Email/phone and password are required.',
      });
    }

    let query;

    if (identifier.includes('@')) {
      if (!emailRegex.test(identifier)) {
        return res.status(400).send({
          error: 'Please enter a valid email address.',
        });
      }

      query = { email: identifier };
    } else {
      const normalizedPhone = normalizePhone(identifier);

      if (!isValidIndianPhone(normalizedPhone)) {
        return res.status(400).send({
          error: 'Please enter a valid 10-digit Indian phone number.',
        });
      }

      query = { phone: normalizedPhone };
    }

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).send({
        error: 'No account found with this email or phone number.',
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).send({
        error: 'Incorrect password.',
      });
    }

    const token = makeToken(user);

    res.send({
      user: user.toSafeUser(),
      token,
    });
  } catch (error) {
    res.status(500).send({
      error: 'Server error. Please try again.',
    });
  }
};

const getProfile = async (req, res) => {
  res.send(req.user.toSafeUser());
};

module.exports = {
  register,
  login,
  getProfile,
};