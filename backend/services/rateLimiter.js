import {rateLimit} from "express-rate-limit"
export const loginLimiter = rateLimit({
  windowMs: 2.5* 60 * 1000, 
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime - new Date()) / 1000);
    res.status(429).json({
      status: 429,
      errMessage: `Too many attempts. Try again after ${retryAfter}s.`,
      retryAfter,
    });
  }
});