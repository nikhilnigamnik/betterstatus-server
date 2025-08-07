import { userService } from '@/services/user';
import { Context } from 'hono';
import { STATUS_CODE } from '@/constants/status-code';
import { hashPassword } from '@/lib/password';
import { parseRequest } from '@/lib/request';
import { signupSchema } from '@/validator/auth.validator';
import { getIpInfo } from '@/lib/ipinfo';
import { sendWelcomeEmail } from '@/email/transporter';

export const signupController = async (c: Context) => {
  const { body } = await parseRequest(c, signupSchema);
  const ipInfo = await getIpInfo();

  const { email, password, name, provider, avatarUrl } = body;

  const authProvider = provider as 'email' | 'google' | 'github';

  const existingUser = await userService.getUserByEmail(email);

  if (existingUser) {
    return c.json(
      {
        message: 'Account already exists with this email',
      },
      STATUS_CODE.CONFLICT
    );
  }

  await sendWelcomeEmail(email, name);

  let userData;

  if (authProvider === 'email') {
    const hashedPassword = await hashPassword(password);
    userData = {
      email,
      password: hashedPassword,
      name,
      auth_provider: authProvider,
      role: 'user' as const,
      is_active: false,
      email_verified_at: null,
      avatar_url: avatarUrl,
    };
  } else {
    userData = {
      email,
      password: '',
      name,
      auth_provider: authProvider,
      role: 'user' as const,
      is_active: true,
      email_verified_at: new Date(),
      avatar_url: avatarUrl,
    };
  }

  const user = await userService.createUser(userData);

  await userService.createSigninHistory(user.id, ipInfo);

  return c.json(
    {
      message:
        authProvider === 'email'
          ? 'Account created successfully. Please check your email for verification.'
          : 'Account created successfully',
    },
    STATUS_CODE.CREATED
  );
};
