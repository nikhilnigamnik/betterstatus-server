import {
  createMonitorController,
  getUserMonitorController,
} from "@/controller/monitor";
import { authenticate } from "@/middleware/auth";
import { Hono } from "hono";

export const monitorRoutes = new Hono();

monitorRoutes.get("/", authenticate(["user"]), getUserMonitorController);
monitorRoutes.post("/", authenticate(["user"]), createMonitorController);
