import { parseRequest } from "@/lib/request";
import { monitorService } from "@/services/monitor";
import { Context } from "hono";

export const getUserMonitorController = async (c: Context) => {
  const { auth } = await parseRequest(c);
  const monitor = await monitorService.getMonitorByUserId(auth.id);
  return c.json(monitor);
};
