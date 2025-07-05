import { Hono } from "hono";
import { AppContext } from "../middleware/auth";
import { authRoutes } from "./auth.routes";
import { jobRoutes } from "./jobs.routes";
import { jobLogRoutes } from "./job-logs.routes";
import { userRoutes } from "./users.routes";
import {
  getWaitlistController,
  waitlistController,
} from "@/controller/waitlist";
import { rateLimit } from "@/middleware/rate-limit";

const app = new Hono<AppContext>();

// waitlist routes
app.post("/waitlist", rateLimit, waitlistController);
app.get("/waitlist", getWaitlistController);

// auth routes
app.route("/auth", authRoutes);

// job routes
app.route("/jobs", jobRoutes);

// job logs routes
app.route("/job-logs", jobLogRoutes);

// user routes
app.route("/users", userRoutes);

export default app;
