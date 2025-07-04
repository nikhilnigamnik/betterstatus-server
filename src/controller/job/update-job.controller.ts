import { jobService } from "@/services/job";
import { Context } from "hono";

export const updateJobController = async (c: Context) => {
  const { id } = c.req.param();
  const jobData = await c.req.json();
  const job = await jobService.updateJob(id, jobData);
  return c.json(job);
};
