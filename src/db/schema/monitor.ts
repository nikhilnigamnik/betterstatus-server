import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { workspace } from "./workspace";
import { httpMethodEnum, monitorTypeEnum, statusEnum } from "./enums";

export const monitor = pgTable("monitor", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: monitorTypeEnum("type").notNull().default("website"),
  method: httpMethodEnum("method").default("GET"),
  headers: json("headers"),
  body: json("body"),
  frequency_seconds: integer("frequency_seconds").default(60), // every X seconds
  timeout_ms: integer("timeout_ms").default(5000),
  status: statusEnum("status").default("active"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const monitor_log = pgTable("monitor_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  monitor_id: uuid("monitor_id")
    .notNull()
    .references(() => monitor.id, { onDelete: "cascade" }),
  status_code: integer("status_code"),
  response_time_ms: integer("response_time_ms"),
  response_body: text("response_body"),
  error_message: text("error_message"),
  created_at: timestamp("created_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
