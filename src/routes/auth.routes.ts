import {
  signinController,
  signoutController,
  signupController,
  profileController,
  getSigninHistoryController,
} from '@/controller/auth';
import { verifyEmailController } from '@/controller/auth/verify.controller';
import { rateLimiterMiddleware } from '@/lib/rate-limiter';
import { authenticate } from '@/middleware/auth';
import { Hono } from 'hono';

export const authRoutes = new Hono();

authRoutes.post('/signin', rateLimiterMiddleware({ limit: 5 }), signinController);
authRoutes.post('/signup', rateLimiterMiddleware({ limit: 5 }), signupController);
authRoutes.get('/verify', rateLimiterMiddleware({ limit: 5 }), verifyEmailController);
authRoutes.get('/signout', authenticate(['user']), signoutController);
authRoutes.get('/me', authenticate(['user']), profileController);
authRoutes.get('/signin-history', authenticate(), getSigninHistoryController);
