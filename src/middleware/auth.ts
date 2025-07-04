import type { Context, Next } from "hono";
import { verifyToken } from "@/lib/jwt";
import { getCookie } from "hono/cookie";

export interface AuthenticatedContext extends Context {
  Variables: {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  };
}

export type AppContext = {
  Variables: {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  };
};

export const authenticate = (roles?: string[]) => {
  return async (
    c: Context<AppContext>,
    next: Next
  ): Promise<Response | void> => {
    try {
      const token = getCookie(c, "auth_token");

      if (!token) {
        return c.json({ success: false, error: "Access token required" }, 401);
      }

      const decoded = await verifyToken(token);

      if (!decoded) {
        return c.json(
          { success: false, error: "Invalid or expired token" },
          401
        );
      }

      c.set("user", {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      if (roles && !roles.includes(decoded.role)) {
        return c.json(
          { success: false, error: "Insufficient permissions" },
          403
        );
      }

      await next();
    } catch (error) {
      console.error("Authentication error:", error);
      return c.json({ success: false, error: "Authentication failed" }, 401);
    }
  };
};
