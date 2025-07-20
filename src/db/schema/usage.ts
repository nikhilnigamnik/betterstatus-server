import {
  index,
  integer,
  numeric,
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const usage_metrics = pgTable(
  "usage_metrics",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    user_id: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    total_checks: integer("total_checks").notNull().default(0),
    successful_checks: integer("successful_checks").notNull().default(0),
    failed_checks: integer("failed_checks").notNull().default(0),

    avg_response_time_ms: integer("avg_response_time_ms"),
    max_response_time_ms: integer("max_response_time_ms"),
    error_rate: numeric("error_rate", { precision: 5, scale: 2 }),

    incidents_created: integer("incidents_created").notNull().default(0),
    monitors_active: integer("monitors_active").notNull().default(0),
    downtime_duration_ms: integer("downtime_duration_ms").notNull().default(0),
    retries_triggered: integer("retries_triggered").notNull().default(0),
    cron_jobs_executed: integer("cron_jobs_executed").notNull().default(0),
    notifications_sent: integer("notifications_sent").notNull().default(0),
    status_page_views: integer("status_page_views").notNull().default(0),

    date: timestamp("date").notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
  },
  (table) => [index("user_date_idx").on(table.user_id, table.date)]
);
