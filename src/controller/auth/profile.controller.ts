import { STATUS_CODE } from '@/constants/status-code';
import { parseRequest } from '@/lib/request';
import { userService } from '@/services/user';
import { Context } from 'hono';

export async function profileController(c: Context) {
  const { auth } = await parseRequest(c);

  const user = await userService.getUserById(auth.id);

  if (!user) {
    return c.json({ message: 'User not found' }, STATUS_CODE.NOT_FOUND);
  }

  return c.json(user, STATUS_CODE.SUCCESS);
}
