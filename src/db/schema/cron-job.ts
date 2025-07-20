import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { endpoint } from "./monitor";
import { jobStatusEnum } from "./enums";

export const cronJob = pgTable(
  "cron_job",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    endpoint_id: uuid("endpoint_id")
      .notNull()
      .references(() => endpoint.id, { onDelete: "cascade" }),

    bullmq_job_id: varchar("bullmq_job_id", { length: 255 }).unique(),
    cron_expression: varchar("cron_expression", { length: 100 }),
    interval_seconds: integer("interval_seconds"),

    is_active: boolean("is_active").notNull().default(true),

    last_run_at: timestamp("last_run_at"),
    next_run_at: timestamp("next_run_at"),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("cron_job_endpoint_id_idx").on(table.endpoint_id),
    index("cron_job_next_run_at_idx").on(table.next_run_at),
  ]
);

export const jobExecution = pgTable(
  "job_execution",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    cron_job_id: uuid("cron_job_id")
      .notNull()
      .references(() => cronJob.id, { onDelete: "cascade" }),

    endpoint_id: uuid("endpoint_id")
      .notNull()
      .references(() => endpoint.id, { onDelete: "cascade" }),

    status: jobStatusEnum("status").notNull(),

    execution_time_ms: integer("execution_time_ms"),
    error_message: text("error_message"),
    retry_count: integer("retry_count").notNull().default(0),
    executed_at: timestamp("executed_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
  },
  (table) => [
    index("job_execution_cron_job_id_idx").on(table.cron_job_id),
    index("job_execution_endpoint_id_idx").on(table.endpoint_id),
    index("job_execution_executed_at_idx").on(table.executed_at),
  ]
);
