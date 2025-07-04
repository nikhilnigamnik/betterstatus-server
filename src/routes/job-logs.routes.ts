import {
  getLogsController,
  getJobStatsController,
} from "@/controller/job-logs";
import { Hono } from "hono";

export const jobLogRoutes = new Hono();

jobLogRoutes.get("/", getLogsController);
jobLogRoutes.get("/job/:jobId/stats", getJobStatsController);
