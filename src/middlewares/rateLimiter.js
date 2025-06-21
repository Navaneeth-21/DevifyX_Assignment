const rateLimit = require('express-rate-limit');
const constants = require('../utils/constants');

exports.limiter = rateLimit({
  windowMs: constants.RATE_LIMIT.WINDOW_MS,
  max: constants.RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many export requests, please try again later.',
});