import { STATUS_CODE } from "@/constants/status-code";
import { parseRequest } from "@/lib/request";
import { userService } from "@/services/user";
import { Context } from "hono";

export const forgotPasswordController = async (c: Context) => {
  const { body } = await parseRequest(c);

  const user = await userService.getUserByEmail(body.email);

  if (!user) {
    return c.json({ message: "User not found" }, STATUS_CODE.BAD_REQUEST);
  }
};
