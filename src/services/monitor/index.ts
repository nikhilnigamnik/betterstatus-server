import { monitor } from '@/db';
import { db } from '@/utils';
import { eq, asc } from 'drizzle-orm';

export const monitorService = {
  getMonitor: async (id: string) => {
    const res = await db.select().from(monitor).where(eq(monitor.id, id));
    return res[0];
  },

  getMonitors: async () => {
    const res = await db.select().from(monitor);
    return res;
  },

  getMonitorByUserId: async (userId: string) => {
    const res = await db
      .select()
      .from(monitor)
      .where(eq(monitor.user_id, userId))
      .orderBy(asc(monitor.created_at));
    return res;
  },
  createMonitor: async (monitorData: typeof monitor.$inferInsert) => {
    const [newMonitor] = await db.insert(monitor).values(monitorData).returning();
    return newMonitor;
  },

  updateMonitor: async (id: string, monitorData: typeof monitor.$inferInsert) => {
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
