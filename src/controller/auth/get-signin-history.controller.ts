import { parseRequest } from '@/lib/request';
import { userService } from '@/services/user';
import { Context } from 'hono';

export const getSigninHistoryController = async (c: Context) => {
  const { auth } = await parseRequest(c);
  const signinHistory = await userService.getSigninHistory(auth.id);
  return c.json(signinHistory);
};
