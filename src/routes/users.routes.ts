import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from '@/controller/user';
import { Hono } from 'hono';

export const userRoutes = new Hono();

userRoutes.get('/', getUsersController);
userRoutes.get('/:id', getUserController);
userRoutes.post('/', createUserController);
userRoutes.patch('/:id', updateUserController);
userRoutes.delete('/:id', deleteUserController);
