import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";
import { generateToken, verifyToken } from "./jwt";
import { isProduction } from "@/utils";

const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function setAuthCookie(c: Context, payload: Record<string, any>) {
  const token = await generateToken(payload);

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return token;
}

export async function getUserFromCookie<T = Record<string, any>>(
  c: Context
): Promise<T | null> {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return null;

  const payload = await verifyToken<T>(token);
  return payload;
}

export function clearAuthCookie(c: Context) {
  deleteCookie(c, COOKIE_NAME, { path: "/" });
}
