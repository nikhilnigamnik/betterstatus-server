import {
  createJobController,
  deleteJobController,
  updateJobController,
  getJobController,
  getJobsController,
  getUserJobController,
} from "@/controller/job";
import { Hono } from "hono";

export const jobRoutes = new Hono();

jobRoutes.get("/", getJobsController);
jobRoutes.get("/:id", getJobController);
jobRoutes.post("/", createJobController);
jobRoutes.patch("/:id", updateJobController);
jobRoutes.delete("/:id", deleteJobController);
jobRoutes.get("/user/:id", getUserJobController);
