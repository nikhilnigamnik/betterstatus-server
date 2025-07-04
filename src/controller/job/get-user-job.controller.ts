import { jobService } from "@/services/job";
import { Context } from "hono";

export const getUserJobController = async (c: Context) => {
  const { id } = c.req.param();
  const job = await jobService.getJobsByUserId(id);
  return c.json(job);
};
