import { Hono } from "hono";
import { AppContext } from "../middleware/auth";
import { authRoutes } from "./auth.routes";

import { userRoutes } from "./users.routes";

const app = new Hono<AppContext>();

// auth routes
app.route("/auth", authRoutes);

// user routes
app.route("/users", userRoutes);

export default app;
