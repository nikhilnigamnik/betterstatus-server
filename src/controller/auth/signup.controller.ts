import { STATUS_CODE } from '@/constants/status-code';
import { setAuthCookie } from '@/lib/cookie';
import { userService } from '@/services/user';
import { Context } from 'hono';
import { getIpInfo } from '@/lib/ipinfo';
import { sendVerifyEmail, sendWelcomeEmail } from '@/email/transporter';
import { generateToken } from '@/lib/jwt';

export const signupController = async (c: Context) => {
  const { email, provider, name, avatarUrl } = await c.req.json();

  const ipInfo = await getIpInfo();

  if (provider === 'email') {
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      return c.json({ message: 'Account already exists' }, STATUS_CODE.CONFLICT);
    }

    const newUser = await userService.createUser({
      name,
      email,
      password: null,
      auth_provider: 'email',
      provider_id: null,
      avatar_url: null,
      role: 'user',
      is_active: false,
      email_verified_at: null,
    });

    const token = await generateToken({ id: newUser.id });

    await sendVerifyEmail(email, token);

    return c.json(
      { message: 'Account created successfully. Please verify your email.' },
      STATUS_CODE.CREATED
    );
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
