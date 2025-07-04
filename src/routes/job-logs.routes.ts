import {
  getLogsController,
  getJobStatsController,
} from "@/controller/job-logs";
import { Hono } from "hono";
import { jobLogService } from "@/services/job-logs";

export const jobLogRoutes = new Hono();

jobLogRoutes.get("/", getLogsController);
jobLogRoutes.get("/job/:jobId/stats", getJobStatsController);
