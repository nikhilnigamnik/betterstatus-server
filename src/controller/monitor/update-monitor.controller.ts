import { parseRequest } from '@/lib/request';
import { monitorService } from '@/services/monitor';
import { Context } from 'hono';

export const updateMonitorController = async (c: Context) => {
  const { id } = c.req.param();
  const { body } = await parseRequest(c);
  console.log(body);
  const monitor = await monitorService.updateMonitor(id, body);
  return c.json(monitor);
};
