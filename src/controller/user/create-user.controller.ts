import { STATUS_CODE } from "@/constants/status-code";
import { userService } from "@/services/user";
import { Context } from "hono";

export const createUserController = async (c: Context) => {
  const userData = await c.req.json();

  const existingUser = await userService.getUserByEmail(userData.email);
  if (existingUser) {
    return c.json({ error: "User already exists" }, STATUS_CODE.CONFLICT);
  }

  const user = await userService.createUser(userData);
  return c.json(user, STATUS_CODE.CREATED);
};
