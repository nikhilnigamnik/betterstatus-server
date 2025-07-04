export { getLogsController } from "./get-logs.controller";

import { jobLogService } from "@/services/job-logs";
import { Context } from "hono";

export const getJobStatsController = async (c: Context) => {
  const jobId = c.req.param("jobId");

  if (!jobId) {
    return c.json({ error: "Job ID is required" }, 400);
  }

  const stats = await jobLogService.getJobStats(jobId);
  return c.json(stats);
};
