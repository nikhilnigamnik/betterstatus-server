import { STATUS_CODE } from "@/constants/status-code";
import { setAuthCookie } from "@/lib/cookie";
import { comparePassword } from "@/lib/password";
import { userService } from "@/services/user";
import { Context } from "hono";

export const signinController = async (c: Context) => {
  const { email, password, provider, name } = await c.req.json();

  if (provider === "email") {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return c.json({ message: "User not found" }, STATUS_CODE.NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return c.json(
        { message: "Invalid email or password" },
        STATUS_CODE.UNAUTHORIZED
      );
    }

    await setAuthCookie(c, {
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
  }

  if (provider === "google") {
    let user = await userService.getUserByEmail(email);

    if (!user) {
      user = await userService.createUser({
        name,
        email,
        password: "",
        provider,
        role: "user",
        is_active: true,
        is_verified: true,
      });
    }

    await setAuthCookie(c, {
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
  }

  if (provider === "github") {
    let user = await userService.getUserByEmail(email);

    if (!user) {
      user = await userService.createUser({
        name,
        email,
        password: "",
        provider,
        role: "user",
        is_active: true,
        is_verified: true,
      });
    }

    await setAuthCookie(c, {
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
  }

  return c.json({ message: "Invalid provider" }, STATUS_CODE.BAD_REQUEST);
};
