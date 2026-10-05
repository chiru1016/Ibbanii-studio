const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  res.status(403).send({ error: 'Access denied. Admin only.' });
};

module.exports = { auth, admin };