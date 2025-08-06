import { parseRequest } from '@/lib/request';
import { monitorService } from '@/services/monitor';
import { createMonitorSchema } from '@/validator';
import { Context } from 'hono';

export const createMonitorController = async (c: Context) => {
  const { auth, body, errors } = await parseRequest(c, createMonitorSchema);

  if (errors.length > 0) {
    return c.json({ success: false, errors }, 400);
  }

  const monitor = await monitorService.createMonitor({
    ...body,
    user_id: auth.id,
  });
  return c.json(monitor);
};
