import { userService } from "@/services/user";
import { Context } from "hono";
import { STATUS_CODE } from "@/constants/status-code";
import { hashPassword } from "@/lib/password";
import { setAuthCookie } from "@/lib/cookie";

export const signupController = async (c: Context) => {
  const { email, password, name, provider } = await c.req.json();

  if (!email || !name || !provider) {
    return c.json(
      { error: "Email, name, and provider are required" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (provider === "email" && !password) {
    return c.json(
      { error: "Password is required for email signup" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return c.json({ error: "User already exists" }, STATUS_CODE.CONFLICT);
  }

  let newUser;

  if (provider === "email") {
    const hashedPassword = await hashPassword(password);
    newUser = await userService.createUser({
      email,
      password: hashedPassword,
      name,
      provider,
      role: "user",
      is_active: true,
      is_verified: false,
    });
  } else if (provider === "google" || provider === "github") {
    newUser = await userService.createUser({
      email,
      password: "",
      name,
      provider,
      role: "user",
      is_active: true,
      is_verified: true,
    });
  } else {
    return c.json({ error: "Invalid provider" }, STATUS_CODE.BAD_REQUEST);
  }

  await setAuthCookie(c, {
    id: newUser.id,
    role: newUser.role,
    email: newUser.email,
  });

  return c.json(
    { message: "Signup successful", user: newUser },
    STATUS_CODE.CREATED
  );
};
