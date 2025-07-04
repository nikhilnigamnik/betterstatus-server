import { STATUS_CODE } from "@/constants/status-code";
import { jobService } from "@/services/job";
import { Context } from "hono";

export const createJobController = async (c: Context) => {
  const jobData = await c.req.json();

  if (!jobData.name || !jobData.url || !jobData.method) {
    return c.json(
      { error: "Missing required fields" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const job = await jobService.createJob(jobData);
  return c.json(job);
};
