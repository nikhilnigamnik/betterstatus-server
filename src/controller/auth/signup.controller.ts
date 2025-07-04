import { userService } from "@/services/user";
import { Context } from "hono";
import { STATUS_CODE } from "@/constants/status-code";
import { hashPassword } from "@/lib/password";

export const signupController = async (c: Context) => {
  const { email, password, name } = await c.req.json();

  if (!email || !password || !name) {
    return c.json(
      { error: "Email, password, and name are required" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const user = await userService.getUserByEmail(email);

  const hashedPassword = await hashPassword(password);

  if (user) {
    return c.json({ error: "User already exists" }, STATUS_CODE.CONFLICT);
  }

  const newUser = await userService.createUser({
    email,
    password: hashedPassword,
    name,
    role: "user",
    is_active: true,
  });

  return c.json(newUser, STATUS_CODE.CREATED);
};
