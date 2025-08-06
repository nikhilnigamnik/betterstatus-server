import { z } from 'zod';
import { Context } from 'hono';

export async function parseRequest(c: Context, schema?: z.ZodSchema<any>) {
  const user = c.get('user');
  const url = c.req.url;
  const searchParams = c.req.query();
  const searchQuery = c.req.query('q') ?? '';

  let body = null;
  let errors: string[] = [];

  try {
    if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
      body = await c.req.json();
    }
  } catch {
    try {
      body = await c.req.text();
    } catch {
      errors.push('Failed to parse request body');
      body = null;
    }
  }

  if (schema) {
    const validationResult = schema.safeParse(body);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors.map((err) => err.message);
      errors.push(...validationErrors);
    }
  }

  return {
    auth: user,
    body: sanitizeBody(body),
    searchParams,
    searchQuery,
    url,
    errors,
  };
}

function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function parseHeaders(headers: unknown): Record<string, string> {
  if (!headers || typeof headers !== 'object' || headers === null) return {};
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof key === 'string' && typeof value === 'string') {
      result[key] = value;
    }
  }
  return result;
}
