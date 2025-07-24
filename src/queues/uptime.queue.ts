import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const connection = new Redis();
const endpointQueue = new Queue("endpoint-checks", { connection });

export { endpointQueue, Worker, connection };
