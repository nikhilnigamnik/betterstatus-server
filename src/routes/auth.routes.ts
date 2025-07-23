import {
  signinController,
  signoutController,
  signupController,
  profileController,
} from "@/controller/auth";
import { verifyEmailController } from "@/controller/auth/verify.controller";
import { authenticate } from "@/middleware/auth";
import { Hono } from "hono";

export const authRoutes = new Hono();

authRoutes.post("/signin", signinController);
authRoutes.post("/signup", signupController);
authRoutes.get("/verify", verifyEmailController);
authRoutes.get("/signout", authenticate(["user"]), signoutController);
authRoutes.get("/me", authenticate(["user"]), profileController);
