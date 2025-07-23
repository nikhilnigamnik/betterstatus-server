import { parseRequest } from "@/lib/request";
import { monitorService } from "@/services/monitor";
import { Context } from "hono";

export const createMonitorController = async (c: Context) => {
  const { auth, body } = await parseRequest(c);
  const monitor = await monitorService.createMonitor({
    ...body,
    user_id: auth.id,
  });
  return c.json(monitor);
};
