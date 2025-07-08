import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { workspace } from "./workspace";
import { httpMethodEnum, statusEnum } from "./enums";

export const cron_job = pgTable("cron_job", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  method: httpMethodEnum("method").notNull().default("GET"),
  headers: json("headers"),
  body: json("body"),
  cron_expression: text("cron_expression"),
  interval_seconds: integer("interval_seconds"),
  timeout_ms: integer("timeout_ms").default(10000),
  max_retries: integer("max_retries").default(3),
  last_run_at: timestamp("last_run_at"),
  next_run_at: timestamp("next_run_at"),
  last_success_at: timestamp("last_success_at"),
  last_failure_at: timestamp("last_failure_at"),
  status: statusEnum("status").default("active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const cron_job_log = pgTable("cron_job_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  cron_job_id: uuid("cron_job_id")
    .notNull()
    .references(() => cron_job.id, { onDelete: "cascade" }),
  status_code: integer("status_code"),
  response_body: text("response_body"),
  error_message: text("error_message"),
  duration_ms: integer("duration_ms"),
  retry_count: integer("retry_count").default(0),
  succeed_at: timestamp("succeed_at"),
  failed_at: timestamp("failed_at"),
  run_at: timestamp("run_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});
