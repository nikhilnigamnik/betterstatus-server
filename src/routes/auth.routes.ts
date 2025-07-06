import { signinController, signupController } from "@/controller/auth";
import { verifyEmailController } from "@/controller/auth/verify.controller";
import { Hono } from "hono";

export const authRoutes = new Hono();

authRoutes.post("/signin", signinController);
authRoutes.post("/signup", signupController);
authRoutes.get("/verify", verifyEmailController);
