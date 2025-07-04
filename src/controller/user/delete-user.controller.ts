import { STATUS_CODE } from "@/constants/status-code";
import { userService } from "@/services/user";
import { Context } from "hono";

export const deleteUserController = async (c: Context) => {
  const { id } = c.req.param();
  await userService.deleteUser(id);
  return c.json({ message: "User deleted successfully" }, STATUS_CODE.OK);
};
