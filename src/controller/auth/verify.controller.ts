import { STATUS_CODE } from '@/constants/status-code';
import { sendWelcomeEmail } from '@/email/transporter';
import { setAuthCookie } from '@/lib/cookie';
import { getIpInfo } from '@/lib/ipinfo';
import { verifyToken } from '@/lib/jwt';
import { parseRequest } from '@/lib/request';
import { userService } from '@/services/user';
import { Context } from 'hono';

interface EmailVerificationToken {
  id: string;
  exp: number;
}

export const verifyEmailController = async (c: Context) => {
  const { searchParams } = await parseRequest(c);
  const token = searchParams.token;

  if (!token) {
    return c.json({ message: 'Verification token is required' }, STATUS_CODE.BAD_REQUEST);
  }

  let decodedToken: EmailVerificationToken | null = null;
  
  try {
    decodedToken = await verifyToken<EmailVerificationToken>(token);
  } catch {
    return c.json({ message: 'Invalid or expired verification token' }, STATUS_CODE.BAD_REQUEST);
  }

  if (!decodedToken?.id) {
    return c.json({ message: 'Invalid or expired verification token' }, STATUS_CODE.BAD_REQUEST);
  }

  const user = await userService.getInactiveUserById(decodedToken.id);
  if (!user) {
    return c.json({ message: 'Invalid or expired verification token' }, STATUS_CODE.BAD_REQUEST);
  }

  if (user.email_verified_at && user.is_active) {
    return c.json({ message: 'Email is already verified' }, STATUS_CODE.OK);
  }

  await userService.updateUserById(user.id, {
    is_active: true,
    email_verified_at: new Date(),
  });

  const ipInfo = await getIpInfo();

  await Promise.all([
    setAuthCookie(c, {
      id: user.id,
      role: user.role,
      email: user.email,
    }),
    userService.createSigninHistory(user.id, ipInfo),
    sendWelcomeEmail(user.email, user.name as string),
  ]);

  return c.json({ message: 'Email verified!' }, STATUS_CODE.OK);
};
