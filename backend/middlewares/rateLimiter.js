const rateLimit = require('express-rate-limit');

const rateLimiter = () => {
  return rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
};

module.exports = rateLimiter;