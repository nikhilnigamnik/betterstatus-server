import { Context, Next } from "hono";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(private config: RateLimitConfig) {}

  getMessage(): string {
    return this.config.message;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (record.count >= this.config.max) {
      return false;
    }

    record.count++;
    return true;
  }
}

const generalLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const apiLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "API rate limit exceeded, please try again later.",
});

const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later.",
});

export const generalRateLimit = async (
  c: Context,
  next: Next
): Promise<Response | void> => {
  const ip = c.req.header("x-forwarded-for") ?? "unknown";

  if (!generalLimiter.check(ip)) {
    return c.json(
      {
        success: false,
        error: generalLimiter.getMessage(),
      },
      429
    );
  }

  await next();
};

export const apiRateLimit = async (
  c: Context,
  next: Next
): Promise<Response | void> => {
  const ip = c.req.header("x-forwarded-for") ?? "unknown";

  if (!apiLimiter.check(ip)) {
    return c.json(
      {
        success: false,
        error: apiLimiter.getMessage(),
      },
      429
    );
  }

  await next();
};

export const authRateLimit = async (
  c: Context,
  next: Next
): Promise<Response | void> => {
  const ip = c.req.header("x-forwarded-for") || "unknown";

  if (!authLimiter.check(ip)) {
    return c.json(
      {
        success: false,
        error: authLimiter.getMessage(),
      },
      429
    );
  }

  await next();
};
