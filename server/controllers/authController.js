const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if at least one contact field is provided
    if (!email && !phone) {
      return res.status(400).send({ error: 'Email or phone is required for registration' });
    }

    // Role is always customer for public registration
    const user = new User({ 
      name, 
      email: email || undefined, 
      phone: phone || undefined, 
      password, 
      role: 'customer' 
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).send({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).send({ error: `That ${field} is already registered. Try logging in.` });
    }
    res.status(500).send({ error: 'Server error. Please try again in a moment.' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.send({ user, token });
  } catch (error) {
    res.status(500).send({ error: 'Server error. Please try again in a moment.' });
  }
};

const getProfile = async (req, res) => {
  res.send(req.user);
};

module.exports = { register, login, getProfile };
