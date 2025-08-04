import { serve } from '@hono/node-server';
import app from './index';
import { env } from './utils/env';
import logger from './utils/logger';

function startServer() {
  const port = env.port;

  serve({ fetch: app.fetch, port });

  logger.info(`🚀 Server running on port ${port}`);
  logger.info(`📊 Environment: ${env.environment}`);
  logger.info(`🔗 API: http://localhost:${port}/api`);
}

if (require.main === module) {
  startServer();
}
