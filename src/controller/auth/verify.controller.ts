import { STATUS_CODE } from "@/constants/status-code";
import { decodeToken } from "@/lib/jwt";
import { userService } from "@/services/user";
import { Context } from "hono";

export const verifyEmailController = async (c: Context) => {
  const token = c.req.query("token");

  if (!token) {
    return c.json(
      { error: "Verification token is required" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const decodedToken = decodeToken(token);

  const user = await userService.getUserById(decodedToken.id);

  if (!user) {
    return c.json(
      { error: "Invalid or expired verification token" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (user.is_verified) {
    return c.json({ message: "Email is already verified" }, STATUS_CODE.OK);
  }

  await userService.updateUser(user.id, {
    ...user,
    is_verified: true,
  });

  return c.json({ message: "Email verified successfully" }, STATUS_CODE.OK);
};
