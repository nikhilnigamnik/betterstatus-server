import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const redis = new Redis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export function createQueue(name: string) {
  return new Queue(name, { connection: redis });
}
