import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { monitor } from "./monitor";
import { incidentStatusEnum } from "./enums";

export const incident = pgTable("incident", {
  id: uuid("id").primaryKey().defaultRandom(),
  monitor_id: uuid("monitor_id")
    .notNull()
    .references(() => monitor.id, { onDelete: "cascade" }),
  title: text("title"),
  description: text("description"),
  started_at: timestamp("started_at").defaultNow(),
  downtime_seconds: integer("downtime_seconds"),
  resolved_at: timestamp("resolved_at"),
  status: incidentStatusEnum("status").default("investigating"),
});

