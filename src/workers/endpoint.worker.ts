import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { checkEndpointJob } from "@/jobs/endpoint-check.job";

export const endpointCheckWorker = new Worker(
  "endpoint-checks",
  async (job) => {
    const { endpoint } = job.data;
    return checkEndpointJob(endpoint);
  },
  { connection: redis }
);
