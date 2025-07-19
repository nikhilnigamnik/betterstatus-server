import { cron_job } from "@/db";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export const jobService = {
  /**
   * Retrieves a job by its unique identifier
   * @param id - The unique identifier of the job
   * @returns Promise resolving to an array containing the job or empty array if not found
   */
  getJobById: async (id: string) => {
    const job = await db.select().from(cron_job).where(eq(cron_job.id, id));
    return job;
  },

  /**
   * Retrieves all jobs from the database
   * @returns Promise resolving to an array of all jobs
   */
  getAllJobs: async () => {
    const job = await db.select().from(cron_job);
    return job;
  },

  getActiveJobs: async () => {
    const job = await db
      .select()
      .from(cron_job)
      .where(eq(cron_job.status, "active"));
    return job;
  },

  /**
   * Creates a new job in the database
   * @param jobData - The job data to insert, must match the jobs table schema
   * @returns Promise resolving to the created job object
   */
  createJob: async (jobData: typeof cron_job.$inferInsert) => {
    const [job] = await db.insert(cron_job).values(jobData).returning();
    return job;
  },

  /**
   * Updates an existing job by its unique identifier
   * @param id - The unique identifier of the job to update
   * @param jobData - The updated job data
   * @returns Promise resolving to the updated job object
   */
  updateJob: async (id: string, jobData: typeof cron_job.$inferSelect) => {
    const [job] = await db
      .update(cron_job)
      .set(jobData)
      .where(eq(cron_job.id, id))
      .returning();
    return job;
  },

  /**
   * Deletes a job by its unique identifier
   * @param id - The unique identifier of the job to delete
   * @returns Promise resolving to the deleted job object
   */
  deleteJob: async (id: string) => {
    const [job] = await db
      .delete(cron_job)
      .where(eq(cron_job.id, id))
      .returning();
    return job;
  },

  /**
   * Retrieves all jobs associated with a specific user
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to an array of jobs belonging to the user
   */
  getJobsByWorkspaceId: async (workspaceId: string) => {
    const job = await db
      .select()
      .from(cron_job)
      .where(eq(cron_job.workspace_id, workspaceId));
    return job;
  },
};
