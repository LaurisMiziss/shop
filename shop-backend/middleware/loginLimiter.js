const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    info: "Too many register or login attempts. Try again later."
  }
});

module.exports = loginLimiter;