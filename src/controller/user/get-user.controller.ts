import { userService } from "@/services/user";
import { Context } from "hono";

export const getUserController = async (c: Context) => {
  const { id } = c.req.param();
  const user = await userService.getUserById(id);
  return c.json(user);
};
