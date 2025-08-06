import { monitor_logs, monitor } from '@/db';
import { db } from '@/utils';
import { eq, desc, and, gte, lte, count, sql } from 'drizzle-orm';

export const monitorLogsService = {
  // Get a single monitor log by ID
  getMonitorLog: async (id: string) => {
    const res = await db.select().from(monitor_logs).where(eq(monitor_logs.id, id));
    return res[0];
  },

  // Get all monitor logs
  getMonitorLogs: async () => {
    const res = await db.select().from(monitor_logs).orderBy(desc(monitor_logs.checked_at));
    return res;
  },

  // Get monitor logs by monitor ID
  getMonitorLogsByMonitorId: async (monitorId: string, limit?: number) => {
    const query = db
      .select()
      .from(monitor_logs)
      .where(eq(monitor_logs.monitor_id, monitorId))
      .orderBy(desc(monitor_logs.checked_at));

    if (limit) {
      query.limit(limit);
    }

    const res = await query;
    return res;
  },

  // Get monitor logs with pagination
  getMonitorLogsPaginated: async (page: number = 1, limit: number = 50) => {
    const offset = (page - 1) * limit;

    const logs = await db
      .select()
      .from(monitor_logs)
      .orderBy(desc(monitor_logs.checked_at))
      .limit(limit)
      .offset(offset);

    const totalCount = await db.select({ count: count() }).from(monitor_logs);

    return {
      logs,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit),
      },
    };
  },

  // Get monitor logs by monitor ID with pagination
  getMonitorLogsByMonitorIdPaginated: async (
    monitorId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    const offset = (page - 1) * limit;

    const logs = await db
      .select()
      .from(monitor_logs)
      .where(eq(monitor_logs.monitor_id, monitorId))
      .orderBy(desc(monitor_logs.checked_at))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: count() })
      .from(monitor_logs)
      .where(eq(monitor_logs.monitor_id, monitorId));

    return {
      logs,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit),
      },
    };
  },

  // Get monitor logs by status
  getMonitorLogsByStatus: async (status: 'success' | 'failure' | 'timeout' | 'error') => {
    const res = await db
      .select()
      .from(monitor_logs)
      .where(eq(monitor_logs.status, status))
      .orderBy(desc(monitor_logs.checked_at));
    return res;
  },

  // Get monitor logs by date range
  getMonitorLogsByDateRange: async (startDate: Date, endDate: Date) => {
    const res = await db
      .select()
      .from(monitor_logs)
      .where(and(gte(monitor_logs.checked_at, startDate), lte(monitor_logs.checked_at, endDate)))
      .orderBy(desc(monitor_logs.checked_at));
    return res;
  },

  // Get monitor logs by monitor ID and date range
  getMonitorLogsByMonitorIdAndDateRange: async (
    monitorId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const res = await db
      .select()
      .from(monitor_logs)
      .where(
        and(
          eq(monitor_logs.monitor_id, monitorId),
          gte(monitor_logs.checked_at, startDate),
          lte(monitor_logs.checked_at, endDate)
        )
      )
      .orderBy(desc(monitor_logs.checked_at));
    return res;
  },

  // Create a new monitor log
  createMonitorLog: async (logData: typeof monitor_logs.$inferInsert) => {
    const [newLog] = await db.insert(monitor_logs).values(logData).returning();
    return newLog;
  },

  // Delete a monitor log
  deleteMonitorLog: async (id: string) => {
    const res = await db.delete(monitor_logs).where(eq(monitor_logs.id, id));
    return res;
  },

  // Get monitor logs statistics
  getMonitorLogsStats: async (monitorId?: string) => {
    let whereClause = undefined;
    if (monitorId) {
      whereClause = eq(monitor_logs.monitor_id, monitorId);
    }

    const stats = await db
      .select({
        total: count(),
        success: count(sql`CASE WHEN ${monitor_logs.status} = 'success' THEN 1 END`),
        failure: count(sql`CASE WHEN ${monitor_logs.status} = 'failure' THEN 1 END`),
        timeout: count(sql`CASE WHEN ${monitor_logs.status} = 'timeout' THEN 1 END`),
        error: count(sql`CASE WHEN ${monitor_logs.status} = 'error' THEN 1 END`),
        avg_response_time: sql<number>`AVG(${monitor_logs.response_time})`,
        min_response_time: sql<number>`MIN(${monitor_logs.response_time})`,
        max_response_time: sql<number>`MAX(${monitor_logs.response_time})`,
      })
      .from(monitor_logs)
      .where(whereClause);

    return stats[0];
  },

  // Get monitor logs grouped by status for a specific monitor
  getMonitorLogsByStatusForMonitor: async (monitorId: string) => {
    const stats = await db
      .select({
        status: monitor_logs.status,
        count: count(),
      })
      .from(monitor_logs)
      .where(eq(monitor_logs.monitor_id, monitorId))
      .groupBy(monitor_logs.status);

    return stats;
  },

  // Clean up old monitor logs (delete logs older than specified days)
  cleanupOldMonitorLogs: async (daysOld: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const res = await db.delete(monitor_logs).where(lte(monitor_logs.checked_at, cutoffDate));

    return res;
  },
};
