import { monitor } from "@/db";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export const monitorService = {
  getMonitor: async (id: string) => {
    const res = await db.select().from(monitor).where(eq(monitor.id, id));
    return res;
  },

  getMonitors: async () => {
    const res = await db.select().from(monitor);
    return res;
  },

  getMonitorByUserId: async (userId: string) => {
    const res = await db
      .select()
      .from(monitor)
      .where(eq(monitor.user_id, userId));
    return res;
  },

  createMonitor: async (monitorData: typeof monitor.$inferInsert) => {
    const [newMonitor] = await db
      .insert(monitor)
      .values(monitorData)
      .returning();
    return newMonitor;
  },

  updateMonitor: async (
    id: string,
    monitorData: typeof monitor.$inferInsert
  ) => {
    const [updatedMonitor] = await db
      .update(monitor)
      .set(monitorData)
      .where(eq(monitor.id, id))
      .returning();
    return updatedMonitor;
  },

  deleteMonitor: async (id: string) => {
    const res = await db.delete(monitor).where(eq(monitor.id, id));
    return res;
  },
};
