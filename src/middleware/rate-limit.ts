import { Redis } from "@upstash/redis";

import { Ratelimit } from "@upstash/ratelimit";
import { MiddlewareHandler } from "hono";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "2 h"),
  prefix: "@upstash/ratelimit",
});

export const rateLimit: MiddlewareHandler = async (c, next) => {
  const ip =
    c.req.header("x-forwarded-for") ||
    c.req.header("cf-connecting-ip") ||
    "127.0.0.1";

  const { success, remaining, reset } = await rateLimiter.limit(ip);

  c.header("X-RateLimit-Limit", "10");
  c.header("X-RateLimit-Remaining", remaining.toString());
  c.header("X-RateLimit-Reset", reset.toString());

  if (!success) {
    return c.text("Too many requests", 429);
  }

  await next();
};
