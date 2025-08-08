import { STATUS_CODE } from '@/constants/status-code';
import { setAuthCookie } from '@/lib/cookie';
import { userService } from '@/services/user';
import { Context } from 'hono';
import { getIpInfo } from '@/lib/ipinfo';
import { sendWelcomeEmail } from '@/email/transporter';

export const signinController = async (c: Context) => {
  const { email, provider, name, avatarUrl } = await c.req.json();

  const ipInfo = await getIpInfo();

  if (provider === 'email') {
    const foundUser = await userService.getUserByEmail(email);

    if (!foundUser) {
      return c.json({ message: 'Account not found' }, STATUS_CODE.NOT_FOUND);
    }

    await setAuthCookie(c, {
      id: foundUser.id,
      role: foundUser.role,
      email: foundUser.email,
    });

    await userService.createSigninHistory(foundUser.id, ipInfo);

    return c.json({ message: 'Login successful' }, STATUS_CODE.SUCCESS);
  }

  if (provider === 'google') {
    let existingUser = await userService.getUserByEmail(email);

    if (!existingUser) {
      existingUser = await userService.createUser({
        name,
        email,
        password: null,
        auth_provider: 'google',
        provider_id: null,
        avatar_url: avatarUrl,
        role: 'user',
        is_active: true,
        email_verified_at: new Date(),
      });

      await sendWelcomeEmail(email, name);
    }

    await setAuthCookie(c, {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    });

    await userService.createSigninHistory(existingUser.id, ipInfo);

    return c.json({ message: 'Login successful' }, STATUS_CODE.SUCCESS);
  }

  if (provider === 'github') {
    let existingUser = await userService.getUserByEmail(email);

    if (!existingUser) {
      existingUser = await userService.createUser({
        name,
        email,
        password: null,
        auth_provider: 'github',
        provider_id: null,
        role: 'user',
        is_active: true,
        email_verified_at: new Date(),
      });

      await sendWelcomeEmail(email, name);
    }

    await setAuthCookie(c, {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    });

    await userService.createSigninHistory(existingUser.id, ipInfo);

    return c.json({ message: 'Login successful' }, STATUS_CODE.SUCCESS);
  }

  return c.json({ message: 'Invalid provider' }, STATUS_CODE.BAD_REQUEST);
};
