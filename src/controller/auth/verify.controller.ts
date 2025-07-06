import { STATUS_CODE } from "@/constants/status-code";
import { decodeToken } from "@/lib/jwt";
import { parseRequest } from "@/lib/request";
import { userService } from "@/services/user";
import { Context } from "hono";

export const verifyEmailController = async (c: Context) => {
  const { searchParams } = await parseRequest(c);

  const token = searchParams.token;

  if (!token) {
    return c.json(
      { message: "Verification token is required" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    return c.json(
      { message: "Invalid or expired verification token" },
      STATUS_CODE.BAD_REQUEST
    );
  }

  const user = await userService.getUserById(decodedToken.id);

  if (!user) {
    return c.json(
      { message: "Invalid or expired verification token" },
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
