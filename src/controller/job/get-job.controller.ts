import { jobService } from "@/services/job";
import { Context } from "hono";

export const getJobController = async (c: Context) => {
  const { id } = c.req.param();

  const job = await jobService.getJobById(id);
  return c.json(job);
};
