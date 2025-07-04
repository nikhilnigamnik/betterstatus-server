import { startWorker } from "./lib/job-worker";
import { scheduleJobs } from "./lib/schedule";

scheduleJobs();
startWorker();
