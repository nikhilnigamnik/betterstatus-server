import { jobService } from "@/services/job";
import { Context } from "hono";

export const deleteJobController = async (c: Context) => {
  const { id } = c.req.param();
  const job = await jobService.deleteJob(id);
  return c.json(job);
};
