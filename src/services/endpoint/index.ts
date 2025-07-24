import { endpoint } from "@/db";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export const endpointService = {
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
};
