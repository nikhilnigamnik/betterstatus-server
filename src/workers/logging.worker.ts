import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { saveLogJob } from "@/jobs/save-log.job";

export const saveLogWorker = new Worker(
  "endpoint-logs",
  async (job) => {
    return saveLogJob(job.data);
  },
  { connection: redis }
);
