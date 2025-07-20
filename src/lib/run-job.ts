import { jobs, jobLogs } from "@/db";
import { db } from "@/utils";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";
import { CronExpressionParser } from "cron-parser";
import logger from "@/utils/logger";

export async function runJob(job: any) {
  const startTime = Date.now();
  let statusCode: number | null = null;
  let responseBody: string | null = null;
  let errorMessage: string | null = null;
  let success = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      job.timeout_ms ?? 10000
    );

    const response = await fetch(job.url, {
      method: job.method,
      headers: job.headers ? JSON.parse(job.headers) : {},
      body: job.body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    statusCode = response.status;
    responseBody = await response.text();

    if (response.ok) {
      success = true;
      setImmediate(async () => {
        try {
          const now = new Date();
          await db
            .update(jobs)
            .set({
              last_run_at: now,
              last_success_at: now,
              consecutive_failures: 0,
              next_run_at: getNextRunTime(job.cron_expression),
              updated_at: now,
            })
            .where(eq(jobs.id, job.id));
        } catch (dbError) {
          logger.error(`Database update failed for job ${job.name}:`, dbError);
        }
      });
    } else {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
    const consecutiveFailures = (job.consecutive_failures ?? 0) + 1;
    const shouldRetry = consecutiveFailures <= (job.max_retries ?? 3);

    setImmediate(async () => {
      try {
        const now = new Date();
        await db
          .update(jobs)
          .set({
            last_run_at: now,
            last_failure_at: now,
            consecutive_failures: consecutiveFailures,
            status: shouldRetry ? "active" : "failed",
            next_run_at: shouldRetry
              ? new Date(Date.now() + (job.retry_delay_seconds ?? 60) * 1000)
              : getNextRunTime(job.cron_expression),
            updated_at: now,
          })
          .where(eq(jobs.id, job.id));
      } catch (dbError) {
        logger.error(`Database update failed for job ${job.name}:`, dbError);
      }
    });

    if (shouldRetry) {
      logger.info(
        `🔄 Job ${job.name} will retry in ${job.retry_delay_seconds ?? 60} seconds`
      );
    } else {
      logger.info(`💀 Job ${job.name} exceeded max retries and is now failed`);
    }
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;

    setImmediate(async () => {
      try {
        const now = new Date();
        await db.insert(jobLogs).values({
          job_id: job.id,
          status_code: statusCode,
          response_body: responseBody,
          error_message: errorMessage,
          duration_ms: duration,
          retry_count: job.consecutive_failures ?? 0,
          success: success,
          run_at: now,
        });
      } catch (dbError) {
        logger.error(`Job log insert failed for job ${job.name}:`, dbError);
      }
    });
  }
}

function getNextRunTime(cronExpression: string): Date {
  try {
    const interval = CronExpressionParser.parse(cronExpression, {
      currentDate: new Date(),
      tz: "UTC",
    });
    return interval.next().toDate();
  } catch (error) {
    logger.error(`Invalid cron expression: ${cronExpression}`, error);
    return new Date(Date.now() + 60000);
  }
}
