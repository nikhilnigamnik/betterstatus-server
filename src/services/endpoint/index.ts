import { endpoint } from "@/db";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export const endpointService = {
  getEndpoint: async (endpointId: string) => {
    const res = await db
      .select()
      .from(endpoint)
      .where(eq(endpoint.id, endpointId));
    return res[0] || null;
  },

  getEndpoints: async () => {
    const res = await db.select().from(endpoint);
    return res;
  },

  getActiveEndpoints: async () => {
    const res = await db
      .select()
      .from(endpoint)
      .where(eq(endpoint.is_active, true));
    return res;
  },

  enableEndpoint: async (endpointId: string) => {
    await db
      .update(endpoint)
      .set({ is_active: true })
      .where(eq(endpoint.id, endpointId));
  },

  disableEndpoint: async (endpointId: string) => {
    await db
      .update(endpoint)
      .set({ is_active: false })
      .where(eq(endpoint.id, endpointId));
  },

  updateEndpointTime: async (
    endpointId: string,
    lastCheckedAt: Date,
    nextCheckAt: Date
  ) => {
    await db
      .update(endpoint)
      .set({ last_checked_at: lastCheckedAt, next_check_at: nextCheckAt })
      .where(eq(endpoint.id, endpointId));
  },
};
