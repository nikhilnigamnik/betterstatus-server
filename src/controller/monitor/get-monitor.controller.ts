import { monitorService } from '@/services/monitor';
import { Context } from 'hono';

export const getMonitorController = async (c: Context) => {
  const { id } = c.req.param();
  const monitor = await monitorService.getMonitor(id);
  return c.json(monitor);
};
