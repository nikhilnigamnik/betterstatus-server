import { Context } from "hono";

export async function parseRequest(c: Context) {
  const user = c.get("user");
  const url = c.req.url;
  const searchParams = c.req.query();
  const searchQuery = c.req.query("q") ?? "";

  let body = null;
  try {
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      body = await c.req.json();
    }
  } catch {
    try {
      body = await c.req.text();
    } catch {
      body = null;
    }
  }

  return {
    auth: user,
    body: sanitizeBody(body),
    searchParams,
    searchQuery,
    url,
  };
}

function sanitizeBody(body: any): any {
  if (!body || typeof body !== "object") {
    return body;
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
