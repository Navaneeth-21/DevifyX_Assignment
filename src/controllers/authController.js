const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    logger.error('Missing email or password', { email });
    return res.status(400).json({ error: 'Email and password are required' });
  }
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error('Invalid email format', { email });
    return res.status(400).json({ error: 'Invalid email format' });
  }
  // Password length validation
  if (password.length < 6) {
    logger.error('Password too short', { email });
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    logger.info('User registered', { email });
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    if (error.code === 11000) {
      logger.error('Duplicate email', { email });
      return res.status(400).json({ error: 'Email already exists' });
    }
    logger.error('Registration error', { error: error.message });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error('Invalid credentials', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info('User logged in', { email });
    res.json({ token });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ error: 'Server error' });
  }
};