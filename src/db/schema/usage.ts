import { pgTable, uuid, timestamp, integer, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { workspace } from "./workspace";

export const usage = pgTable("usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  period: text("period").notNull(),
  monitors_count: integer("monitors_count").default(0),
  cron_jobs_count: integer("cron_jobs_count").default(0),
  team_members_count: integer("team_members_count").default(0),
  monitor_checks_count: integer("monitor_checks_count").default(0),
  job_executions_count: integer("job_executions_count").default(0),
  notifications_sent_count: integer("notifications_sent_count").default(0),
  log_entries_count: integer("log_entries_count").default(0),
  incidents_count: integer("incidents_count").default(0),
  storage_used_bytes: integer("storage_used_bytes").default(0),
  api_requests_count: integer("api_requests_count").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
