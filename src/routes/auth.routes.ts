import { signinController, signupController } from "@/controller/auth";
import { Hono } from "hono";

export const authRoutes = new Hono();

authRoutes.post("/signin", signinController);
authRoutes.post("/signup", signupController);
