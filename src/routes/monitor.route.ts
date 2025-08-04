import {
  createMonitorController,
  deleteMonitorController,
  getMonitorController,
  getUserMonitorController,
  updateMonitorController,
} from '@/controller/monitor';
import { authenticate } from '@/middleware/auth';
import { Hono } from 'hono';

export const monitorRoutes = new Hono();

monitorRoutes.get('/', authenticate(['user', 'admin']), getUserMonitorController);
monitorRoutes.post('/', authenticate(['user', 'admin']), createMonitorController);
monitorRoutes.delete('/', authenticate(['user', 'admin']), deleteMonitorController);

monitorRoutes.get('/:id', authenticate(['user', 'admin']), getMonitorController);
monitorRoutes.patch('/:id', authenticate(['user', 'admin']), updateMonitorController);
