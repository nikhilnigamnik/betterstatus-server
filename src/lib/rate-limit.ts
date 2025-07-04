import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Context } from "hono";

export const redis = Redis.fromEnv();

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "2 h"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export function getClientIP(c: Context): string {
  const ip =
    c.req.header("x-forwarded-for") ??
    c.req.header("cf-connecting-ip") ??
    "127.0.0.1";

  return ip;
}

export async function checkRateLimit(ip: string) {
  return await rateLimiter.limit(ip);
}
