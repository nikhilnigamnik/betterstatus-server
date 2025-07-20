import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { endpoint, monitor } from "./monitor";
import { incidentSeverityEnum, incidentStatusEnum } from "./enums";

export const incident = pgTable(
  "incident",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    monitor_id: uuid("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),

    endpoint_id: uuid("endpoint_id").references(() => endpoint.id, {
      onDelete: "cascade",
    }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    status: incidentStatusEnum("status").notNull().default("open"),
    severity: incidentSeverityEnum("severity").notNull().default("medium"),

    started_at: timestamp("started_at").notNull(),
    resolved_at: timestamp("resolved_at"),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("incident_monitor_id_idx").on(table.monitor_id),
    index("incident_endpoint_id_idx").on(table.endpoint_id),
    index("incident_status_idx").on(table.status),
    index("incident_started_at_idx").on(table.started_at.desc()),
  ]
);

export const incident_updates = pgTable(
  "incident_updates",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    incident_id: uuid("incident_id")
      .notNull()
      .references(() => incident.id, { onDelete: "cascade" }),

    message: text("message").notNull(),
    status: incidentStatusEnum("status").notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("incident_updates_incident_id_idx").on(table.incident_id),
    index("incident_updates_created_at_idx").on(table.created_at.desc()),
  ]
);
