const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', {
      message: error.message || 'No error message provided',
      code: error.code || 'No error code',
      name: error.name || 'Unknown error name',
      stack: error.stack || 'No stack trace',
    });
    process.exit(1);
  }
};

module.exports = connectDB;