import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import dotenv from 'dotenv';
import { notFound } from './middleware/error-handler';
import routes from './routes';
import { endpointService } from './services/endpoint';
import { lookupDomain } from './lib/domain-lookup';
import { getSSLCertificateInfo } from './lib/ssl-lookup';
dotenv.config();

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

app.get('/', async (c) => {
  const endpoints = await endpointService.getActiveEndpoints();
  return c.json({
    endpoints,
  });
});

app.route('/api', routes);

app.notFound(notFound);

app.get('/whois', async (c) => {
  const domain = c.req.query('domain') as string;
  const whois = await lookupDomain(domain);
  return c.json(whois);
});

app.get('/ssl', async (c) => {
  const domain = c.req.query('domain') as string;
  const ssl = await getSSLCertificateInfo(domain);
  return c.json(ssl);
});

export default app;
