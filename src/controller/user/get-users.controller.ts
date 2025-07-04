import { userService } from "@/services/user";
import { Context } from "hono";

export const getUsersController = async (c: Context) => {
  const users = await userService.getAllUsers();
  return c.json(users);
};
