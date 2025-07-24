import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const redis = new Redis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const endpointQueue = new Queue("endpoint-checks", {
  connection: redis,
});
export const logQueue = new Queue("endpoint-logs", {
  connection: redis,
});
