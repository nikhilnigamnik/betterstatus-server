import { db } from '@/utils';
import { incident, incident_updates, monitor } from '@/db';
import { eq, asc, desc, and, isNull, isNotNull } from 'drizzle-orm';

export const incidentService = {
  // Get a single incident by ID
  getIncident: async (id: string) => {
    const res = await db.select().from(incident).where(eq(incident.id, id));
    return res[0];
  },

  // Get all incidents
  getIncidents: async () => {
    const res = await db.select().from(incident).orderBy(desc(incident.created_at));
    return res;
  },

  // Get incidents by monitor ID
  getIncidentsByMonitorId: async (monitorId: string) => {
    const res = await db
      .select()
      .from(incident)
      .where(eq(incident.monitor_id, monitorId))
      .orderBy(desc(incident.created_at));
    return res;
  },

  // Get active incidents (not resolved)
  getActiveIncidents: async () => {
    const res = await db
      .select()
      .from(incident)
      .where(and(eq(incident.status, 'investigating'), isNull(incident.resolved_at)))
      .orderBy(desc(incident.created_at));
    return res;
  },

  // Get resolved incidents
  getResolvedIncidents: async () => {
    const res = await db
      .select()
      .from(incident)
      .where(and(eq(incident.status, 'resolved'), isNotNull(incident.resolved_at)))
      .orderBy(desc(incident.resolved_at));
    return res;
  },

  // Get incidents by status
  getIncidentsByStatus: async (
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  ) => {
    const res = await db
      .select()
      .from(incident)
      .where(eq(incident.status, status))
      .orderBy(desc(incident.created_at));
    return res;
  },

  // Get incidents by severity
  getIncidentsBySeverity: async (severity: 'minor' | 'major' | 'critical') => {
    const res = await db
      .select()
      .from(incident)
      .where(eq(incident.severity, severity))
      .orderBy(desc(incident.created_at));
    return res;
  },

  // Create a new incident
  createIncident: async (incidentData: typeof incident.$inferInsert) => {
    const [newIncident] = await db.insert(incident).values(incidentData).returning();
    return newIncident;
  },

  // Update an incident
  updateIncident: async (id: string, incidentData: Partial<typeof incident.$inferInsert>) => {
    const [updatedIncident] = await db
      .update(incident)
      .set({ ...incidentData, updated_at: new Date() })
      .where(eq(incident.id, id))
      .returning();
    return updatedIncident;
  },

  // Delete an incident
  deleteIncident: async (id: string) => {
    const res = await db.delete(incident).where(eq(incident.id, id));
    return res;
  },

  // Resolve an incident
  resolveIncident: async (id: string) => {
    const [resolvedIncident] = await db
      .update(incident)
      .set({
        status: 'resolved',
        resolved_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(incident.id, id))
      .returning();
    return resolvedIncident;
  },

  // Update incident status
  updateIncidentStatus: async (
    id: string,
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  ) => {
    const updateData: any = {
      status,
      updated_at: new Date(),
    };

    // If resolving, set resolved_at timestamp
    if (status === 'resolved') {
      updateData.resolved_at = new Date();
    }

    const [updatedIncident] = await db
      .update(incident)
      .set(updateData)
      .where(eq(incident.id, id))
      .returning();
    return updatedIncident;
  },

  // Get incident with updates
  getIncidentWithUpdates: async (id: string) => {
    const incidentData = await db.select().from(incident).where(eq(incident.id, id));
    const updates = await db
      .select()
      .from(incident_updates)
      .where(eq(incident_updates.incident_id, id))
      .orderBy(asc(incident_updates.created_at));

    return {
      incident: incidentData[0],
      updates,
    };
  },

  // Create incident update
  createIncidentUpdate: async (updateData: typeof incident_updates.$inferInsert) => {
    const [newUpdate] = await db.insert(incident_updates).values(updateData).returning();
    return newUpdate;
  },

  // Get incident updates
  getIncidentUpdates: async (incidentId: string) => {
    const res = await db
      .select()
      .from(incident_updates)
      .where(eq(incident_updates.incident_id, incidentId))
      .orderBy(asc(incident_updates.created_at));
    return res;
  },

  // Get public incident updates
  getPublicIncidentUpdates: async (incidentId: string) => {
    const res = await db
      .select()
      .from(incident_updates)
      .where(
        and(eq(incident_updates.incident_id, incidentId), eq(incident_updates.is_public, true))
      )
      .orderBy(asc(incident_updates.created_at));
    return res;
  },

  // Update incident update
  updateIncidentUpdate: async (
    id: string,
    updateData: Partial<typeof incident_updates.$inferInsert>
  ) => {
    const [updatedUpdate] = await db
      .update(incident_updates)
      .set(updateData)
      .where(eq(incident_updates.id, id))
      .returning();
    return updatedUpdate;
  },

  // Delete incident update
  deleteIncidentUpdate: async (id: string) => {
    const res = await db.delete(incident_updates).where(eq(incident_updates.id, id));
    return res;
  },

  // Get incidents with monitor information
  getIncidentsWithMonitor: async () => {
    const res = await db
      .select({
        incident: incident,
        monitor: monitor,
      })
      .from(incident)
      .leftJoin(monitor, eq(incident.monitor_id, monitor.id))
      .orderBy(desc(incident.created_at));
    return res;
  },

  // Get incident statistics
  getIncidentStats: async () => {
    const totalIncidents = await db.select().from(incident);
    const activeIncidents = await db
      .select()
      .from(incident)
      .where(and(eq(incident.status, 'investigating'), isNull(incident.resolved_at)));
    const resolvedIncidents = await db
      .select()
      .from(incident)
      .where(and(eq(incident.status, 'resolved'), isNotNull(incident.resolved_at)));

    return {
      total: totalIncidents.length,
      active: activeIncidents.length,
      resolved: resolvedIncidents.length,
      bySeverity: {
        minor: totalIncidents.filter((i) => i.severity === 'minor').length,
        major: totalIncidents.filter((i) => i.severity === 'major').length,
        critical: totalIncidents.filter((i) => i.severity === 'critical').length,
      },
      byStatus: {
        investigating: totalIncidents.filter((i) => i.status === 'investigating').length,
        identified: totalIncidents.filter((i) => i.status === 'identified').length,
        monitoring: totalIncidents.filter((i) => i.status === 'monitoring').length,
        resolved: totalIncidents.filter((i) => i.status === 'resolved').length,
      },
    };
  },
};
