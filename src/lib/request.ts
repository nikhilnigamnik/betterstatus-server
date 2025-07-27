import { z } from "zod";
import { Context } from "hono";

export async function parseRequest(c: Context, schema?: z.ZodSchema<any>) {
  const user = c.get("user"); // Get authenticated user
  const url = c.req.url; // Full request URL
  const searchParams = c.req.query(); // All query parameters
  const searchQuery = c.req.query("q") ?? ""; // Specific 'q' parameter

  let body = null;
  let errors: string[] = [];

  try {
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      body = await c.req.json(); // Try JSON first
    }
  } catch {
    try {
      body = await c.req.text(); // Fallback to text
    } catch {
      errors.push("Failed to parse request body");
      body = null;
    }
  }

  if (schema) {
    const validationResult = schema.safeParse(body);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors.map(
        (err) => err.message
      );
      errors.push(...validationErrors);
    }
  }

  return {
    auth: user, // Authenticated user data
    body: sanitizeBody(body), // Sanitized request body
    searchParams, // All query parameters
    searchQuery, // Specific search query
    url, // Request URL
    errors, // Validation/parsing errors
  };
}

function sanitizeBody(body: any): any {
  if (!body || typeof body !== "object") {
    return body; // Return as-is for non-objects
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      sanitized[key] = value.trim().replace(/[<>]/g, "");
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function parseHeaders(headers: unknown): Record<string, string> {
  if (!headers || typeof headers !== "object" || headers === null) return {};
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof key === "string" && typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}
