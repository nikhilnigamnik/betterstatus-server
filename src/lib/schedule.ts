import { jobService } from "@/services/job";
import logger from "@/utils/logger";
import { jobQueue } from "./job-queue";

export function scheduleJobs() {
  setInterval(async () => {
    try {
      const now = new Date();
      const activeJobs = await jobService.getActiveJobs();

      for (const job of activeJobs) {
        const nextRunAt = job.next_run_at ? new Date(job.next_run_at) : null;

        if (!nextRunAt || nextRunAt <= now) {
          await jobQueue.add("execute-job", job, {
            removeOnComplete: true,
            removeOnFail: false,
          });
        }
      }
    } catch (err) {
      logger.error("❌ Scheduler error:", err);
    }
  }, 30 * 1000); // 30 seconds
}
