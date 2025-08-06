import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from '@/controller/user';
import { authenticate } from '@/middleware/auth';
import { Hono } from 'hono';

export const userRoutes = new Hono();

userRoutes.use('*', authenticate());

userRoutes.get('/', getUsersController);
userRoutes.get('/:id', getUserController);
userRoutes.post('/', createUserController);
userRoutes.patch('/:id', updateUserController);
userRoutes.delete('/:id', deleteUserController);
