import { monitorService } from "@/services/monitor";
import { Context } from "hono";

export const getMonitorsController = async (c: Context) => {
  const monitors = await monitorService.getMonitors();
  return c.json(monitors);
};
