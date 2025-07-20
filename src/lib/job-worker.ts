import { Worker } from "bullmq";
import { runJob } from "./run-job";
import { connection } from "./job-queue";
import logger from "@/utils/logger";

export function startWorker() {
  const worker = new Worker(
    "job-queue",
    async (job) => {
      await runJob(job.data);
    },
    { connection }
  );

  worker.on("failed", (job, err) => {
    logger.error(`❌ Job ${job?.name} failed:`, err);
  });

  worker.on("completed", (job) => {
    logger.info(`✅ Job ${job?.name} completed`);
  });
}
