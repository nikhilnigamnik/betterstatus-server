import { rateLimiter } from 'hono-rate-limiter';

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-6',
  keyGenerator: (c) => {
    const cfConnectingIp = c.req.header('cf-connecting-ip');
    if (cfConnectingIp) {
      return cfConnectingIp;
    }

    const xForwardedFor = c.req.header('x-forwarded-for');
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }

    return 'unknown';
  },
});

export const rateLimit = limiter;
