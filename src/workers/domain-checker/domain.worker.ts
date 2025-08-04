import { Worker } from 'bullmq';
import { parse, differenceInCalendarDays } from 'date-fns';
import { lookupDomain } from '@/lib/domain-lookup';
import { redis } from '@/lib/redis';

const ALERT_DAYS = [30, 15, 7, 1];

const worker = new Worker(
  'domain-check',
  async (job) => {
    const { domain } = job.data;

    const result = await lookupDomain(domain);
    const expiresAt = parse(result.expires, 'yyyy-MM-dd HH:mm:ss', new Date());
    const today = new Date();
    const daysLeft = differenceInCalendarDays(expiresAt, today);

    if (ALERT_DAYS.includes(daysLeft)) {
      console.warn(`⚠️ ALERT: ${domain} expires in ${daysLeft} day(s) on ${result.expires}.`);
    } else {
      console.log(`✅ ${domain}: ${daysLeft} day(s) left`);
    }

    return { ...result, daysLeft };
  },
  { connection: redis }
);

worker.on('completed', (job) => {
  console.log(`✔️ Job completed for: ${job.data.domain}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job failed for ${job?.data?.domain}:`, err);
});
