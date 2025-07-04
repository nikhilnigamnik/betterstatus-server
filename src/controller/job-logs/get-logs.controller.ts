import { jobLogService } from "@/services/job-logs";
import { Context } from "hono";

export const getLogsController = async (c: Context) => {
  const jobId = c.req.query("jobId");
  const success = c.req.query("success");
  const limit = parseInt(c.req.query("limit") ?? "50");
  const offset = parseInt(c.req.query("offset") ?? "0");
  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  let successValue: boolean | undefined;
  if (success === "true" || success === "false") {
    successValue = success === "true";
  }

  const logs = await jobLogService.getFilteredJobLogs({
    jobId,
    success: successValue,
    limit,
    offset,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  });

  return c.json(logs);
};
