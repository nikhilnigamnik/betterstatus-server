import { monitorService } from "@/services/monitor";
import { Context } from "hono";

export const deleteMonitorController = async (c: Context) => {
  const { id } = c.req.param();
  const monitor = await monitorService.deleteMonitor(id);
  return c.json(monitor);
};
