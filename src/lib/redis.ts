import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const redis = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

export const endpointQueue = new Queue('endpoint-monitor', {
  connection: redis,
});

export const logQueue = new Queue('endpoint-monitor-logs', {
  connection: redis,
});

export const alertQueue = new Queue('alerts', {
  connection: redis,
});

export const incidentQueue = new Queue('incidents', {
  connection: redis,
});
