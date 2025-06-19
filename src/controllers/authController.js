const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    logger.info('User registered', { email });
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    logger.error('Registration error', { error });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info('User logged in', { email });
    res.json({ token });
  } catch (error) {
    logger.error('Login error', { error });
    res.status(500).json({ error: 'Server error' });
  }
};