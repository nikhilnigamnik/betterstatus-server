import { STATUS_CODE } from '@/constants/status-code';
import { parseRequest } from '@/lib/request';
import { userService } from '@/services/user';
import { Context } from 'hono';

export const createUserController = async (c: Context) => {
  const { body } = await parseRequest(c);

  if (!body.email || !body.password || !body.name) {
    return c.json({ error: 'Invalid request body' }, STATUS_CODE.BAD_REQUEST);
  }

  const existingUser = await userService.getUserByEmail(body.email);
  if (existingUser) {
    return c.json({ error: 'User already exists' }, STATUS_CODE.CONFLICT);
  }

  const user = await userService.createUser(body);
  return c.json(user, STATUS_CODE.CREATED);
};
