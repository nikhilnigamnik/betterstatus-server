import { STATUS_CODE } from "@/constants/status-code";
import { setAuthCookie } from "@/lib/cookie";
import { comparePassword } from "@/lib/password";
import { userService } from "@/services/user";
import { Context } from "hono";

export const signinController = async (c: Context) => {
  const { email, password, provider, name, avatarUrl } = await c.req.json();

  if (provider === "email") {
    const foundUser = await userService.getUserByEmail(email);

    if (!foundUser) {
      return c.json({ message: "User not found" }, STATUS_CODE.NOT_FOUND);
    }

    if (!foundUser.password) {
      return c.json(
        { message: "Invalid email or password" },
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const isPasswordValid = await comparePassword(password, foundUser.password);

    if (!isPasswordValid) {
      return c.json(
        { message: "Invalid email or password" },
        STATUS_CODE.UNAUTHORIZED
      );
    }

    await setAuthCookie(c, {
      id: foundUser.id,
      role: foundUser.role,
      email: foundUser.email,
    });

    return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
  }

  if (provider === "google") {
    let existingUser = await userService.getUserByEmail(email);

    if (!existingUser) {
      existingUser = await userService.createUser({
        name,
        email,
        password: null,
        auth_provider: "google",
        provider_id: null,
        avatar_url: avatarUrl,
        role: "user",
        is_active: true,
        email_verified_at: new Date(),
      });
    }

    await setAuthCookie(c, {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    });

    return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
  }

  if (provider === "github") {
    let existingUser = await userService.getUserByEmail(email);

    if (!existingUser) {
      existingUser = await userService.createUser({
        name,
        email,
        password: null,
        auth_provider: "github",
        provider_id: null,
        role: "user",
        is_active: true,
        email_verified_at: new Date(),
      });
    }

    await setAuthCookie(c, {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    });

    return c.json({ message: "Login successful" }, STATUS_CODE.SUCCESS);
  }

  return c.json({ message: "Invalid provider" }, STATUS_CODE.BAD_REQUEST);
};
