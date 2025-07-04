import { jobLogs } from "@/db";
import { db } from "@/utils";
import { eq, and, gte, lte, desc } from "drizzle-orm";

interface FilterOptions {
  jobId?: string;
  success?: boolean;
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
}

export const jobLogService = {
  /**
   * Retrieves a job log by its unique identifier
   * @param id - The unique identifier of the job log
   * @returns Promise resolving to an array containing the job log or empty array if not found
   */
  getJobLogById: async (id: string) => {
    const jobLog = await db.select().from(jobLogs).where(eq(jobLogs.id, id));
    return jobLog;
  },

  /**
   * Retrieves all job logs from the database
   * @returns Promise resolving to an array of all job logs
   */
  getAllJobLogs: async () => {
    const jobLog = await db.select().from(jobLogs);
    return jobLog;
  },

  /**
   * Retrieves filtered job logs with pagination
   * @param options - Filter options for job logs
   * @returns Promise resolving to an array of filtered job logs
   */
  getFilteredJobLogs: async (options: FilterOptions) => {
    const conditions = [];

    if (options.jobId) {
      conditions.push(eq(jobLogs.job_id, options.jobId));
    }

    if (options.success !== undefined) {
      conditions.push(eq(jobLogs.success, options.success));
    }

    if (options.startDate) {
      conditions.push(gte(jobLogs.run_at, options.startDate));
    }

    if (options.endDate) {
      conditions.push(lte(jobLogs.run_at, options.endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const baseQuery = db.select().from(jobLogs);
    const queryWithWhere = whereClause
      ? baseQuery.where(whereClause)
      : baseQuery;
    const queryWithOrder = queryWithWhere.orderBy(desc(jobLogs.run_at));
    const queryWithLimit = options.limit
      ? queryWithOrder.limit(options.limit)
      : queryWithOrder;
    const finalQuery = options.offset
      ? queryWithLimit.offset(options.offset)
      : queryWithLimit;

    const jobLog = await finalQuery;
    return jobLog;
  },

  /**
   * Creates a new job log in the database
   * @param jobLogData - The job log data to insert, must match the jobLogs table schema
   * @returns Promise resolving to the created job log object
   */
  createJobLog: async (jobLogData: typeof jobLogs.$inferInsert) => {
    const [jobLog] = await db.insert(jobLogs).values(jobLogData).returning();
    return jobLog;
  },

  /**
   * Updates an existing job log by its unique identifier
   * @param id - The unique identifier of the job log to update
   * @param jobLogData - The updated job log data
   * @returns Promise resolving to the updated job log object
   */
  updateJobLog: async (id: string, jobLogData: typeof jobLogs.$inferSelect) => {
    const [jobLog] = await db
      .update(jobLogs)
      .set(jobLogData)
      .where(eq(jobLogs.id, id))
      .returning();
    return jobLog;
  },

  /**
   * Deletes a job log by its unique identifier
   * @param id - The unique identifier of the job log to delete
   * @returns Promise resolving to the deleted job log object
   */
  deleteJobLog: async (id: string) => {
    const [jobLog] = await db
      .delete(jobLogs)
      .where(eq(jobLogs.id, id))
      .returning();
    return jobLog;
  },

  /**
   * Retrieves all job logs associated with a specific job
   * @param jobId - The unique identifier of the job
   * @returns Promise resolving to an array of job logs belonging to the job
   */
  getJobLogsByJobId: async (jobId: string) => {
    const jobLog = await db
      .select()
      .from(jobLogs)
      .where(eq(jobLogs.job_id, jobId));
    return jobLog;
  },

  /**
   * Retrieves statistics for a specific job
   * @param jobId - The unique identifier of the job
   * @returns Promise resolving to job statistics
   */
  getJobStats: async (jobId: string) => {
    const allLogs = await db
      .select()
      .from(jobLogs)
      .where(eq(jobLogs.job_id, jobId))
      .orderBy(desc(jobLogs.run_at));

    const totalRuns = allLogs.length;
    const successfulRuns = allLogs.filter((log) => log.success).length;
    const failedRuns = totalRuns - successfulRuns;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    const durations = allLogs
      .filter((log) => log.duration_ms !== null)
      .map((log) => log.duration_ms!);

    const avgDuration =
      durations.length > 0
        ? durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length
        : 0;

    const recentLogs = allLogs.slice(0, 10);
    const lastRun = allLogs[0];
    const lastSuccess = allLogs.find((log) => log.success);
    const lastFailure = allLogs.find((log) => !log.success);

    return {
      jobId,
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate: Math.round(successRate * 100) / 100,
      averageDurationMs: Math.round(avgDuration),
      lastRun: lastRun?.run_at || null,
      lastSuccess: lastSuccess?.run_at || null,
      lastFailure: lastFailure?.run_at || null,
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        success: log.success,
        statusCode: log.status_code,
        durationMs: log.duration_ms,
        runAt: log.run_at,
        errorMessage: log.error_message,
      })),
    };
  },
};
