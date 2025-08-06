import { Hono } from 'hono';
import { AppContext } from '../middleware/auth';
import { authRoutes } from './auth.routes';

import { userRoutes } from './users.routes';
import { monitorRoutes } from './monitor.route';

const app = new Hono<AppContext>();
// auth routes
app.route('/auth', authRoutes);

// user routes
app.route('/users', userRoutes);

// monitor routes
app.route('/monitor', monitorRoutes);

export default app;
