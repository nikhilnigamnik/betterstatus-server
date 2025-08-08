import { env } from '@/utils';
import logger from '@/utils/logger';
import { sign, verify, decode } from 'hono/jwt';

const JWT_SECRET = env.jwtSecret;
export async function generateToken(payload: Record<string, any>): Promise<string> {
  const JWT_EXPIRY = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; //
  return await sign({ ...payload, exp: JWT_EXPIRY }, JWT_SECRET);
}

export async function verifyToken<T = Record<string, any>>(token: string): Promise<T | null> {
  try {
    return (await verify(token, JWT_SECRET)) as T;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export function decodeToken<T = any>(token: string): T | null {
  try {
    return decode(token) as T;
  } catch {
    return null;
  }
}
