import { STATUS_CODE } from '@/constants/status-code';
import { parseRequest } from '@/lib/request';
import { planService } from '@/services/plan';
import { userService } from '@/services/user';
import { Context } from 'hono';

export async function profileController(c: Context) {
  const { auth } = await parseRequest(c);

  const [user, user_plan] = await Promise.all([
    userService.getUserById(auth.id),
    planService.getUserPlan(auth.id),
  ]);

  if (!user) {
    return c.json({ message: 'User not found' }, STATUS_CODE.NOT_FOUND);
  }

  return c.json({ user, user_plan }, STATUS_CODE.SUCCESS);
}
