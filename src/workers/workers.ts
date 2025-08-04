import { Worker, Job } from 'bullmq';
import { endpointService } from '@/services/endpoint';
import { endpointQueue, redis } from '@/lib/redis';
import {
  EndpointFromService,
  JOB_OPTIONS,
  JobData,
  monitoredEndpoints,
  MonitoringResult,
} from '@/types';
import { performHealthCheck } from '@/lib/health-check';

async function scheduleEndpointJob(endpoint: EndpointFromService, delay = 0) {
  const jobId = `${endpoint.id}:${Date.now()}`;
  await endpointQueue.add(jobId, { endpointId: endpoint.id }, { ...JOB_OPTIONS, delay });
  monitoredEndpoints.add(endpoint.id);
}

async function startMonitoring(endpointId: string): Promise<boolean> {
  if (monitoredEndpoints.has(endpointId)) {
    console.log(`Endpoint ${endpointId} is already being monitored`);
    return false;
  }
  const endpoint = await endpointService.getEndpoint(endpointId);
  if (!endpoint) {
    console.warn(`Endpoint ${endpointId} not found`);
    return false;
  }
  await scheduleEndpointJob(endpoint);
  console.log(`Started monitoring endpoint: ${endpoint.name} (${endpointId})`);
  return true;
}

async function stopMonitoring(endpointId: string) {
  const jobs = await endpointQueue.getJobs(['waiting', 'delayed']);
  const jobsToRemove = jobs.filter((job) => job.data.endpointId === endpointId);
  for (const job of jobsToRemove) await job.remove();
  monitoredEndpoints.delete(endpointId);
  console.log(`Stopped monitoring endpoint: ${endpointId}`);
}

async function monitorEndpoint(endpointId: string) {
  const endpoint = await endpointService.getEndpoint(endpointId);
  if (!endpoint) {
    console.warn(`Endpoint ${endpointId} not found or inactive`);
    monitoredEndpoints.delete(endpointId);
    return;
  }
  const result = await performHealthCheck(endpoint);
  await processResult(endpoint, result);
}

async function processResult(endpoint: EndpointFromService, result: MonitoringResult) {
  const next_run_at = new Date(result.checked_at.getTime() + endpoint.timeout_seconds * 1000);
  console.log({
    endpoint: endpoint.name,
    endpoint_id: endpoint.id,
    status: result.http_status_code,
    success: result.success,
    response_time_ms: result.response_time_ms,
    status_text: result.status_text,
    error_message: result.error_message,
    checked_at: result.checked_at.toISOString(),
    next_run_at: next_run_at.toISOString(),
  });
  await endpointService.updateEndpointTime(endpoint.id, result.checked_at, next_run_at);
  if (!result.success) {
    const errorMsg = `Health check failed for ${endpoint.name} (${
      endpoint.id
    }): ${result.error_message || `HTTP ${result.http_status_code}`}`;
    console.warn(errorMsg);
    throw new Error(errorMsg);
  }
  await scheduleEndpointJob(endpoint, endpoint.timeout_seconds * 1000);
}

async function syncWithDatabase() {
  try {
    const activeEndpoints = await endpointService.getActiveEndpoints();
    const activeEndpointIds = new Set(activeEndpoints.map((e) => e.id));
    for (const endpoint of activeEndpoints) {
      if (!monitoredEndpoints.has(endpoint.id)) {
        await scheduleEndpointJob(endpoint);
        console.log(`Started monitoring new endpoint: ${endpoint.name}`);
      }
    }
    for (const monitoredId of monitoredEndpoints) {
      if (!activeEndpointIds.has(monitoredId)) {
        await stopMonitoring(monitoredId);
      }
    }
  } catch (error) {
    console.error('Failed to sync with database:', error);
  }
}

const worker = new Worker<JobData>(
  endpointQueue.name,
  async (job: Job<JobData>) => {
    await monitorEndpoint(job.data.endpointId);
  },
  { connection: redis, concurrency: 100 }
);

worker.on('failed', async (job, err) => {
  const endpointId = job?.data?.endpointId;
  console.error(`Monitoring job failed:`, {
    job_id: job?.id,
    endpoint_id: endpointId,
    error: err.message,
    attempt: job?.attemptsMade,
    max_attempts: job?.opts?.attempts,
  });
  if (job?.attemptsMade === job?.opts?.attempts && endpointId) {
    try {
      await endpointService.disableEndpoint(endpointId);
      console.warn(`Endpoint ${endpointId} disabled after ${job.attemptsMade} failed attempts`);
    } catch (disableErr) {
      console.error(
        `Failed to disable endpoint ${endpointId}:`,
        disableErr instanceof Error ? disableErr.message : disableErr
      );
    }
  }
});

worker.on('completed', (job) => {
  console.debug(`Monitoring job completed: ${job.id}`);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down worker gracefully...');
  await worker.close();
  process.exit(0);
});

async function initializeEndpoints(): Promise<void> {
  try {
    const endpoints = await endpointService.getActiveEndpoints();
    console.log(`Initializing monitoring for ${endpoints.length} endpoints`);
    const initPromises = endpoints.map((endpoint) => scheduleEndpointJob(endpoint));
    await Promise.all(initPromises);
    console.log('All endpoints initialized successfully');
  } catch (error) {
    console.error('Failed to initialize endpoints:', error);
    throw error;
  }
}

setInterval(syncWithDatabase, 1 * 60 * 1000);
initializeEndpoints().catch((error) => {
  console.error('Critical error during initialization:', error);
  process.exit(1);
});

export {
  worker,
  scheduleEndpointJob,
  startMonitoring,
  stopMonitoring,
  monitorEndpoint,
  syncWithDatabase,
};
