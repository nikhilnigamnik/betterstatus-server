import { domainQueue } from './domain-queue';
import { getAllDomainsFromDB } from './domain.db';

async function enqueueRepeatableJobs() {
  const domains = await getAllDomainsFromDB();

  for (const domain of domains) {
    await domainQueue.add(
      'check-domain',
      { domain },
      {
        repeat: {
          pattern: '0 6 * * *',
        },
        jobId: `check-${domain}`,
        removeOnComplete: true,
      }
    );
  }
}

enqueueRepeatableJobs();
