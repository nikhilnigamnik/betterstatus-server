import {
  createMonitorController,
  deleteMonitorController,
  getMonitorController,
  getMonitorsController,
  getUserMonitorController,
  updateMonitorController,
} from '@/controller/monitor';
import { rateLimiterMiddleware } from '@/lib/rate-limiter';
import { authenticate } from '@/middleware/auth';
import { Hono } from 'hono';

export const monitorRoutes = new Hono();

monitorRoutes.use('*', authenticate());

monitorRoutes.use('*', rateLimiterMiddleware({ limit: 200 }));

monitorRoutes.get('/', getUserMonitorController);
monitorRoutes.get('/all', getMonitorsController);
monitorRoutes.post('/', createMonitorController);
monitorRoutes.delete('/', deleteMonitorController);
monitorRoutes.get('/:id', getMonitorController);
monitorRoutes.patch('/:id', updateMonitorController);
