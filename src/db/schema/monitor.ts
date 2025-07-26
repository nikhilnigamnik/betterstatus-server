import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  index,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { checkStatusEnum, endpointMethodEnum } from "./enums";
import { user } from "./user";
import { incident } from "./incident";

export const monitor = pgTable(
  "monitor",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    user_id: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    base_url: text("base_url").notNull(),

    is_active: boolean("is_active").notNull().default(true),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("monitor_user_id_idx").on(table.user_id),
    index("monitor_base_url_idx").on(table.base_url),
    index("monitor_id_idx").on(table.id),
  ]
);

export const endpoint = pgTable(
  "endpoint",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    monitor_id: uuid("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),
    path: text("path").notNull(),
    method: endpointMethodEnum("method").notNull().default("GET"),

    headers: jsonb("headers"),
    request_body: jsonb("request_body"),

    expected_status_code: integer("expected_status_code")
      .notNull()
      .default(200),

    expected_response_content: jsonb("expected_response_content"),

    timeout_seconds: integer("timeout_seconds").notNull().default(30),
    check_interval_seconds: integer("check_interval_seconds")
      .notNull()
      .default(60),

    is_active: boolean("is_active").notNull().default(true),
    last_checked_at: timestamp("last_checked_at"),
    next_check_at: timestamp("next_check_at").notNull().defaultNow(),
  },
  (table) => [
    index("endpoint_monitor_id_idx").on(table.monitor_id),
    index("endpoint_monitor_active_idx").on(table.monitor_id, table.is_active),
  ]
);

export const monitor_logs = pgTable(
  "monitor_logs",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    endpoint_id: uuid("endpoint_id")
      .notNull()
      .references(() => endpoint.id, { onDelete: "cascade" }),

    status: checkStatusEnum("status").notNull(),

    response_time_ms: integer("response_time_ms"),
    http_status_code: integer("http_status_code"),
    response_body: text("response_body"),
    error_message: text("error_message"),

    checked_at: timestamp("checked_at").notNull().defaultNow(),
    incident_id: uuid("incident_id").references(() => incident.id),
  },
  (table) => [
    index("monitor_logs_endpoint_id_idx").on(table.endpoint_id),
    index("monitor_logs_endpoint_checked_idx").on(
      table.endpoint_id,
      table.checked_at.desc()
    ),
    index("monitor_logs_incident_id_idx").on(table.incident_id),
    index("monitor_logs_checked_at_idx").on(table.checked_at.desc()),
  ]
);
