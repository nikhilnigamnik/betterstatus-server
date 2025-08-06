import { status_page, status_page_monitors, monitor, user, incident, incident_updates } from '@/db';
import { db } from '@/utils';
import { eq, and, asc, desc, isNull, or } from 'drizzle-orm';

export const statusPageService = {
  /**
   * Get a status page by ID
   */
  getStatusPage: async (id: string) => {
    const [foundStatusPage] = await db.select().from(status_page).where(eq(status_page.id, id));
    return foundStatusPage;
  },

  /**
   * Get a public status page by ID
   */
  getPublicStatusPage: async (id: string) => {
    const [foundStatusPage] = await db
      .select()
      .from(status_page)
      .where(and(eq(status_page.id, id), eq(status_page.is_public, true)));
    return foundStatusPage;
  },

  /**
   * Get a status page by custom domain
   */
  getStatusPageByDomain: async (domain: string) => {
    const [foundStatusPage] = await db
      .select()
      .from(status_page)
      .where(and(eq(status_page.custom_domain, domain), eq(status_page.is_public, true)));
    return foundStatusPage;
  },

  /**
   * Get all status pages for a user
   */
  getStatusPagesByUserId: async (userId: string) => {
    return await db
      .select()
      .from(status_page)
      .where(eq(status_page.user_id, userId))
      .orderBy(asc(status_page.created_at));
  },

  /**
   * Get all public status pages
   */
  getPublicStatusPages: async () => {
    return await db
      .select()
      .from(status_page)
      .where(eq(status_page.is_public, true))
      .orderBy(asc(status_page.created_at));
  },

  /**
   * Create a new status page
   */
  createStatusPage: async (statusPageData: typeof status_page.$inferInsert) => {
    const [newStatusPage] = await db.insert(status_page).values(statusPageData).returning();
    return newStatusPage;
  },

  /**
   * Update an existing status page
   */
  updateStatusPage: async (
    id: string,
    statusPageData: Partial<typeof status_page.$inferInsert>
  ) => {
    const [updatedStatusPage] = await db
      .update(status_page)
      .set(statusPageData)
      .where(eq(status_page.id, id))
      .returning();
    return updatedStatusPage;
  },

  /**
   * Delete a status page
   */
  deleteStatusPage: async (id: string) => {
    await db.delete(status_page).where(eq(status_page.id, id));
  },

  /**
   * Update status page system status
   */
  updateStatusPageSystemStatus: async (id: string, status: string, message?: string) => {
    const [updatedStatusPage] = await db
      .update(status_page)
      .set({
        status_message: message,
        last_status_change_at: new Date(),
      })
      .where(eq(status_page.id, id))
      .returning();
    return updatedStatusPage;
  },

  /**
   * Get monitors for a status page
   */
  getStatusPageMonitors: async (statusPageId: string) => {
    return await db
      .select({
        id: status_page_monitors.id,
        display_name: status_page_monitors.display_name,
        display_order: status_page_monitors.display_order,
        is_public: status_page_monitors.is_public,
        monitor: {
          id: monitor.id,
          name: monitor.name,
          description: monitor.description,
          base_url: monitor.base_url,
          is_active: monitor.is_active,
          last_check_at: monitor.last_check_at,
        },
      })
      .from(status_page_monitors)
      .innerJoin(monitor, eq(status_page_monitors.monitor_id, monitor.id))
      .where(eq(status_page_monitors.status_page_id, statusPageId))
      .orderBy(asc(status_page_monitors.display_order));
  },

  /**
   * Get public monitors for a status page
   */
  getPublicStatusPageMonitors: async (statusPageId: string) => {
    return await db
      .select({
        id: status_page_monitors.id,
        display_name: status_page_monitors.display_name,
        display_order: status_page_monitors.display_order,
        monitor: {
          id: monitor.id,
          name: monitor.name,
          description: monitor.description,
          base_url: monitor.base_url,
          is_active: monitor.is_active,
          last_check_at: monitor.last_check_at,
        },
      })
      .from(status_page_monitors)
      .innerJoin(monitor, eq(status_page_monitors.monitor_id, monitor.id))
      .where(
        and(
          eq(status_page_monitors.status_page_id, statusPageId),
          eq(status_page_monitors.is_public, true)
        )
      )
      .orderBy(asc(status_page_monitors.display_order));
  },

  /**
   * Add a monitor to a status page
   */
  addMonitorToStatusPage: async (
    statusPageId: string,
    monitorId: string,
    displayName?: string,
    displayOrder?: number
  ) => {
    const [newStatusPageMonitor] = await db
      .insert(status_page_monitors)
      .values({
        status_page_id: statusPageId,
        monitor_id: monitorId,
        display_name: displayName,
        display_order: displayOrder || 0,
      })
      .returning();
    return newStatusPageMonitor;
  },

  /**
   * Update a status page monitor
   */
  updateStatusPageMonitor: async (
    id: string,
    updateData: Partial<typeof status_page_monitors.$inferInsert>
  ) => {
    const [updatedStatusPageMonitor] = await db
      .update(status_page_monitors)
      .set(updateData)
      .where(eq(status_page_monitors.id, id))
      .returning();
    return updatedStatusPageMonitor;
  },

  /**
   * Remove a monitor from a status page
   */
  removeMonitorFromStatusPage: async (id: string) => {
    await db.delete(status_page_monitors).where(eq(status_page_monitors.id, id));
  },

  /**
   * Get incidents for a status page (aggregated from all monitors)
   */
  getStatusPageIncidents: async (statusPageId: string, limit = 10) => {
    return await db
      .select({
        id: incident.id,
        title: incident.title,
        description: incident.description,
        status: incident.status,
        severity: incident.severity,
        started_at: incident.started_at,
        resolved_at: incident.resolved_at,
        monitor: {
          id: monitor.id,
          name: monitor.name,
        },
      })
      .from(incident)
      .innerJoin(monitor, eq(incident.monitor_id, monitor.id))
      .innerJoin(status_page_monitors, eq(monitor.id, status_page_monitors.monitor_id))
      .where(
        and(eq(status_page_monitors.status_page_id, statusPageId), isNull(incident.deleted_at))
      )
      .orderBy(desc(incident.started_at))
      .limit(limit);
  },

  /**
   * Get active incidents for a status page
   */
  getActiveStatusPageIncidents: async (statusPageId: string) => {
    return await db
      .select({
        id: incident.id,
        title: incident.title,
        description: incident.description,
        status: incident.status,
        severity: incident.severity,
        started_at: incident.started_at,
        monitor: {
          id: monitor.id,
          name: monitor.name,
        },
      })
      .from(incident)
      .innerJoin(monitor, eq(incident.monitor_id, monitor.id))
      .innerJoin(status_page_monitors, eq(monitor.id, status_page_monitors.monitor_id))
      .where(
        and(
          eq(status_page_monitors.status_page_id, statusPageId),
          isNull(incident.deleted_at),
          or(
            eq(incident.status, 'investigating'),
            eq(incident.status, 'identified'),
            eq(incident.status, 'monitoring')
          )
        )
      )
      .orderBy(desc(incident.started_at));
  },

  /**
   * Get incident updates for a status page
   */
  getStatusPageIncidentUpdates: async (statusPageId: string, limit = 20) => {
    return await db
      .select({
        id: incident_updates.id,
        status: incident_updates.status,
        message: incident_updates.message,
        is_public: incident_updates.is_public,
        created_at: incident_updates.created_at,
        incident: {
          id: incident.id,
          title: incident.title,
          severity: incident.severity,
        },
        monitor: {
          id: monitor.id,
          name: monitor.name,
        },
      })
      .from(incident_updates)
      .innerJoin(incident, eq(incident_updates.incident_id, incident.id))
      .innerJoin(monitor, eq(incident.monitor_id, monitor.id))
      .innerJoin(status_page_monitors, eq(monitor.id, status_page_monitors.monitor_id))
      .where(
        and(
          eq(status_page_monitors.status_page_id, statusPageId),
          isNull(incident_updates.deleted_at),
          isNull(incident.deleted_at)
        )
      )
      .orderBy(desc(incident_updates.created_at))
      .limit(limit);
  },

  /**
   * Get public incident updates for a status page
   */
  getPublicStatusPageIncidentUpdates: async (statusPageId: string, limit = 20) => {
    return await db
      .select({
        id: incident_updates.id,
        status: incident_updates.status,
        message: incident_updates.message,
        created_at: incident_updates.created_at,
        incident: {
          id: incident.id,
          title: incident.title,
          severity: incident.severity,
        },
        monitor: {
          id: monitor.id,
          name: monitor.name,
        },
      })
      .from(incident_updates)
      .innerJoin(incident, eq(incident_updates.incident_id, incident.id))
      .innerJoin(monitor, eq(incident.monitor_id, monitor.id))
      .innerJoin(status_page_monitors, eq(monitor.id, status_page_monitors.monitor_id))
      .where(
        and(
          eq(status_page_monitors.status_page_id, statusPageId),
          eq(incident_updates.is_public, true),
          isNull(incident_updates.deleted_at),
          isNull(incident.deleted_at)
        )
      )
      .orderBy(desc(incident_updates.created_at))
      .limit(limit);
  },

  /**
   * Check if user owns the status page
   */
  isStatusPageOwner: async (statusPageId: string, userId: string) => {
    const [foundStatusPage] = await db
      .select({ id: status_page.id })
      .from(status_page)
      .where(and(eq(status_page.id, statusPageId), eq(status_page.user_id, userId)));
    return !!foundStatusPage;
  },

  /**
   * Get status page with owner information
   */
  getStatusPageWithOwner: async (id: string) => {
    const [foundStatusPage] = await db
      .select({
        id: status_page.id,
        name: status_page.name,
        description: status_page.description,
        image_url: status_page.image_url,
        favicon_url: status_page.favicon_url,
        custom_domain: status_page.custom_domain,
        is_public: status_page.is_public,
        status: status_page.status,
        status_message: status_page.status_message,
        last_status_change_at: status_page.last_status_change_at,
        created_at: status_page.created_at,
        updated_at: status_page.updated_at,
        owner: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(status_page)
      .innerJoin(user, eq(status_page.user_id, user.id))
      .where(eq(status_page.id, id));
    return foundStatusPage;
  },
};
