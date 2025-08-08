import { rateLimiter } from 'hono-rate-limiter';

export const rateLimiterMiddleware = (options: any = {}) => {
  return rateLimiter({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    limit: options.limit || 100,
    standardHeaders: 'draft-7',
    keyGenerator: (c) => {
      const xff = c.req.header('x-forwarded-for');
      if (xff) return xff.split(',')[0].trim();
      const cf = c.req.header('cf-connecting-ip');
      if (cf) return cf;
      const realIp = c.req.header('x-real-ip');
      if (realIp) return realIp;
      // @ts-ignore
      const remoteAddr = c.req.raw?.connection?.remoteAddress;
      if (remoteAddr) return remoteAddr;
      return c.req.header('host') || 'unknown';
    },
    ...options,
  });
};
