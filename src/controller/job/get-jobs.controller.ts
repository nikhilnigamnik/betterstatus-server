import { jobService } from "@/services/job";
import { Context } from "hono";

export const getJobsController = async (c: Context) => {
  const jobs = await jobService.getAllJobs();
  return c.json(jobs);
};
