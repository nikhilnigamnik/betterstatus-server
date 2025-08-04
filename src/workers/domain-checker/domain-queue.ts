import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

export const domainQueue = new Queue('domain-check', {
  connection: redis,
});
