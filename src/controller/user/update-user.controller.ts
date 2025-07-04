import { userService } from "@/services/user";
import { Context } from "hono";

export const updateUserController = async (c: Context) => {
  const { id } = c.req.param();
  const userData = await c.req.json();
  const user = await userService.updateUser(id, userData);
  return c.json(user);
};
