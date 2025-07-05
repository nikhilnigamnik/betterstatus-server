import { rateLimiter } from "hono-rate-limiter";

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
});

export const rateLimit = limiter;
