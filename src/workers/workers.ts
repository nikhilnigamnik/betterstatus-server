import { Worker, Job } from "bullmq";
import fetch from "node-fetch";
import { performance } from "perf_hooks";
import { endpointService } from "@/services/endpoint";
import { endpointQueue, redis } from "@/lib/redis";

interface JobData {
  endpointId: string;
}

interface MonitoringResult {
  response_time_ms: number;
  http_status_code: number | null;
  error_message: string | null;
  success: boolean;
  status_text: string | null;
  checked_at: Date;
}

type EndpointFromService = Awaited<
  ReturnType<typeof endpointService.getActiveEndpoints>
>[0];

class EndpointMonitor {
  private static readonly JOB_OPTIONS = {
    removeOnComplete: 10,
    removeOnFail: 50,
    attempts: 3,
  };

  private static monitoredEndpoints = new Set<string>();

  static async scheduleEndpointJob(
    endpoint: EndpointFromService,
    delay: number = 0
  ): Promise<void> {
    const jobId = `${endpoint.id}:${Date.now()}`;

    await endpointQueue.add(
      jobId,
      { endpointId: endpoint.id },
      {
        ...this.JOB_OPTIONS,
        delay,
      }
    );

    this.monitoredEndpoints.add(endpoint.id);
  }

  // New method to start monitoring a single endpoint
  static async startMonitoring(endpointId: string): Promise<boolean> {
    if (this.monitoredEndpoints.has(endpointId)) {
      console.log(`Endpoint ${endpointId} is already being monitored`);
      return false;
    }

    const endpoint = await endpointService.getEndpoint(endpointId);
    if (!endpoint) {
      console.warn(`Endpoint ${endpointId} not found`);
      return false;
    }

    await this.scheduleEndpointJob(endpoint);
    console.log(
      `Started monitoring endpoint: ${endpoint.name} (${endpointId})`
    );
    return true;
  }

  // New method to stop monitoring an endpoint
  static async stopMonitoring(endpointId: string): Promise<void> {
    // Remove all jobs for this endpoint
    const jobs = await endpointQueue.getJobs(["waiting", "delayed"]);
    const jobsToRemove = jobs.filter(
      (job) => job.data.endpointId === endpointId
    );

    for (const job of jobsToRemove) {
      await job.remove();
    }

    this.monitoredEndpoints.delete(endpointId);
    console.log(`Stopped monitoring endpoint: ${endpointId}`);
  }

  static async monitorEndpoint(endpointId: string): Promise<void> {
    const endpoint = await this.getEndpoint(endpointId);
    if (!endpoint) {
      console.warn(`Endpoint ${endpointId} not found or inactive`);
      // Remove from monitored set if endpoint no longer exists
      this.monitoredEndpoints.delete(endpointId);
      return;
    }

    const result = await this.performHealthCheck(endpoint);
    await this.processResult(endpoint, result);
  }

  private static async getEndpoint(
    endpointId: string
  ): Promise<EndpointFromService | null> {
    return await endpointService.getEndpoint(endpointId);
  }

  private static async performHealthCheck(
    endpoint: EndpointFromService
  ): Promise<MonitoringResult> {
    const start = performance.now();
    const checked_at = new Date();

    let response_time_ms = 0;
    let http_status_code: number | null = null;
    let error_message: string | null = null;
    let success = false;
    let status_text: string | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const headers = this.parseHeaders(endpoint.headers);

      const response = await fetch(endpoint.path, {
        method: endpoint.method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      response_time_ms = Math.round(performance.now() - start);
      http_status_code = response.status;
      success = response.ok;
      status_text = response.statusText;
    } catch (err) {
      response_time_ms = Math.round(performance.now() - start);
      error_message = err instanceof Error ? err.message : String(err);
      success = false;

      console.error(`Health check failed for ${endpoint.name}:`, {
        error: error_message,
        response_time_ms,
        endpoint_id: endpoint.id,
      });
    }

    return {
      response_time_ms,
      http_status_code,
      error_message,
      success,
      status_text,
      checked_at,
    };
  }

  private static parseHeaders(headers: unknown): Record<string, string> {
    if (!headers) return {};

    if (typeof headers === "object" && headers !== null) {
      const result: Record<string, string> = {};

      for (const [key, value] of Object.entries(headers)) {
        if (typeof key === "string" && typeof value === "string") {
          result[key] = value;
        }
      }

      return result;
    }

    return {};
  }

  private static async processResult(
    endpoint: EndpointFromService,
    result: MonitoringResult
  ): Promise<void> {
    const next_run_at = new Date(
      result.checked_at.getTime() + endpoint.check_interval_seconds * 1000
    );

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

    await endpointService.updateEndpointTime(
      endpoint.id,
      result.checked_at,
      next_run_at
    );

    if (!result.success) {
      const errorMsg = `Health check failed for ${endpoint.name} (${
        endpoint.id
      }): ${result.error_message || `HTTP ${result.http_status_code}`}`;

      console.warn(errorMsg);
      throw new Error(errorMsg);
    }

    await this.scheduleEndpointJob(
      endpoint,
      endpoint.check_interval_seconds * 1000
    );
  }

  // Method to sync with database (optional - for periodic sync)
  static async syncWithDatabase(): Promise<void> {
    try {
      const activeEndpoints = await endpointService.getActiveEndpoints();
      const activeEndpointIds = new Set(activeEndpoints.map((e) => e.id));

      // Start monitoring new endpoints
      for (const endpoint of activeEndpoints) {
        if (!this.monitoredEndpoints.has(endpoint.id)) {
          await this.scheduleEndpointJob(endpoint);
          console.log(`Started monitoring new endpoint: ${endpoint.name}`);
        }
      }

      // Stop monitoring removed endpoints
      for (const monitoredId of this.monitoredEndpoints) {
        if (!activeEndpointIds.has(monitoredId)) {
          await this.stopMonitoring(monitoredId);
        }
      }
    } catch (error) {
      console.error("Failed to sync with database:", error);
    }
  }
}

const worker = new Worker<JobData>(
  endpointQueue.name,
  async (job: Job<JobData>) => {
    const { endpointId } = job.data;
    await EndpointMonitor.monitorEndpoint(endpointId);
  },
  {
    connection: redis,
    concurrency: 100,
  }
);

worker.on("failed", async (job, err) => {
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
      console.warn(
        `Endpoint ${endpointId} disabled after ${job.attemptsMade} failed attempts`
      );
    } catch (disableErr) {
      console.error(
        `Failed to disable endpoint ${endpointId}:`,
        disableErr instanceof Error ? disableErr.message : disableErr
      );
    }
  }
});

worker.on("completed", (job) => {
  console.debug(`Monitoring job completed: ${job.id}`);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down worker gracefully...");
  await worker.close();
  process.exit(0);
});

async function initializeEndpoints(): Promise<void> {
  try {
    const endpoints = await endpointService.getActiveEndpoints();
    console.log(`Initializing monitoring for ${endpoints.length} endpoints`);

    const initPromises = endpoints.map((endpoint) =>
      EndpointMonitor.scheduleEndpointJob(endpoint)
    );

    await Promise.all(initPromises);
    console.log("All endpoints initialized successfully");
  } catch (error) {
    console.error("Failed to initialize endpoints:", error);
    throw error;
  }
}

setInterval(async () => {
  await EndpointMonitor.syncWithDatabase();
}, 1 * 60 * 1000);

initializeEndpoints().catch((error) => {
  console.error("Critical error during initialization:", error);
  process.exit(1);
});

export { worker, EndpointMonitor };
