const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each user/IP
  message: {
    success: false,
    message: "Too many requests, try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = apiLimiter;