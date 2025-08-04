import {
  createEndpointController,
  deleteEndpointController,
  getEndpointController,
  updateEndpointController,
} from '@/controller/endpoint';
import { authenticate } from '@/middleware/auth';
import { Hono } from 'hono';

export const endpointRoutes = new Hono();
endpointRoutes.get('/', authenticate(['user', 'admin']), getEndpointController);
endpointRoutes.post('/', authenticate(['user', 'admin']), createEndpointController);
endpointRoutes.delete('/', authenticate(['user', 'admin']), deleteEndpointController);
endpointRoutes.patch('/:id', authenticate(['user', 'admin']), updateEndpointController);
