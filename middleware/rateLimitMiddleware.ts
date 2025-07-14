// middleware/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});
