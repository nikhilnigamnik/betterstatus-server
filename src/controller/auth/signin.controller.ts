import { STATUS_CODE } from "@/constants/status-code";
import { setAuthCookie } from "@/lib/cookie";
import { comparePassword } from "@/lib/password";
import { userService } from "@/services/user";
import { Context } from "hono";

export const signinController = async (c: Context) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json(
      { error: "Email and password are required" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const user = await userService.getUserByEmail(email);

  if (!user) {
    return c.json({ error: "User not found" }, STATUS_CODE.NOT_FOUND);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return c.json(
      { error: "Invalid email or password" },
      STATUS_CODE.UNAUTHORIZED
    );
  }

  await setAuthCookie(c, { id: user.id, role: user.role, email: user.email });

  return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
};
