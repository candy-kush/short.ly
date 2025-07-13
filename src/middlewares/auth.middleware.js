const rateLimit = require('express-rate-limit');

const requestRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = {
  requestRateLimiter,
};
