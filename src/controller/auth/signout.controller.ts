import { STATUS_CODE } from '@/constants/status-code';
import { clearAuthCookie } from '@/lib/cookie';
import { Context } from 'hono';

export async function signoutController(c: Context) {
  clearAuthCookie(c);
  return c.json({ message: 'Signed out successfully' }, STATUS_CODE.SUCCESS);
}
