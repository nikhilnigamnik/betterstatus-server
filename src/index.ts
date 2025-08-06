import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { notFound } from './middleware/error-handler';
import routes from './routes';

const app = new Hono();

app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'BetterStatus API is running',
  });
});

app.route('/api', routes);
app.notFound(notFound);

export default app;
