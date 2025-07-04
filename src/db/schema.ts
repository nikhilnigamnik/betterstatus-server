import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  json,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const httpMethodEnum = pgEnum("http_method", [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "active",
  "paused",
  "failed",
  "completed",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // uuid eg: 123e4567-e89b-12d3-a456-426614174000
  name: text("name").notNull(), // name eg: John Doe
  email: text("email").notNull().unique(), // email eg: john.doe@example.com
  password: text("password").notNull(), // password eg: password123
  role: text("role").notNull().default("user"), // role eg: user, admin
  is_active: boolean("is_active").default(true).notNull(), // is_active eg: true
  is_verified: boolean("is_verified").default(false).notNull(), // is_verified eg: false

  created_at: timestamp("created_at").defaultNow().notNull(), // created_at eg: 2021-01-01 00:00:00
  updated_at: timestamp("updated_at").defaultNow().notNull(), // updated_at eg: 2021-01-01 00:00:00
});

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(), // uuid eg: 123e4567-e89b-12d3-a456-426614174000
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // user_id eg: 123e4567-e89b-12d3-a456-426614174000

    name: text("name").notNull(), // name eg: Job 1

    url: text("url").notNull(), // url eg: https://example.com
    method: httpMethodEnum("method").notNull().default("GET"), // method eg: GET, POST, PUT, DELETE, PATCH
    headers: json("headers"), // headers eg: { "Content-Type": "application/json" }
    body: json("body"), // body eg: { "name": "John Doe" }

    cron_expression: text("cron_expression"), // cron_expression eg: 0 0 * * *
    interval_seconds: integer("interval_seconds"), // interval_seconds eg: 60
    timeout_ms: integer("timeout_ms").default(10000), // timeout_ms eg: 10000

    max_retries: integer("max_retries").default(3), // max_retries eg: 3
    retry_delay_seconds: integer("retry_delay_seconds").default(60), // retry_delay_seconds eg: 60
    consecutive_failures: integer("consecutive_failures").default(0), // consecutive_failures eg: 0

    status: jobStatusEnum("status").default("active").notNull(), // status eg: active, paused, failed, completed
    is_active: boolean("is_active").default(true).notNull(), // is_active eg: true

    last_run_at: timestamp("last_run_at"), // last_run_at eg: 2021-01-01 00:00:00
    next_run_at: timestamp("next_run_at"), // next_run_at eg: 2021-01-01 00:00:00
    last_success_at: timestamp("last_success_at"), // last_success_at eg: 2021-01-01 00:00:00
    last_failure_at: timestamp("last_failure_at"), // last_failure_at eg: 2021-01-01 00:00:00

    created_at: timestamp("created_at").defaultNow().notNull(), // created_at eg: 2021-01-01 00:00:00
    updated_at: timestamp("updated_at").defaultNow().notNull(), // updated_at eg: 2021-01-01 00:00:00
  },
  (table) => [
    index("next_run_idx").on(table.next_run_at),
    index("status_idx").on(table.status),
    index("user_id_idx").on(table.user_id),
  ]
);

export const jobLogs = pgTable(
  "job_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(), // uuid eg: 123e4567-e89b-12d3-a456-426614174000
    job_id: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }), // job_id eg: 123e4567-e89b-12d3-a456-426614174000

    status_code: integer("status_code"), // status_code eg: 200
    response_body: text("response_body"), // response_body eg: { "name": "John Doe" }
    error_message: text("error_message"), // error_message eg: "Error message"
    duration_ms: integer("duration_ms"), // duration_ms eg: 1000
    retry_count: integer("retry_count").default(0), // retry_count eg: 0

    success: boolean("success").default(false).notNull(), // success eg: true
    run_at: timestamp("run_at").defaultNow().notNull(), // run_at eg: 2021-01-01 00:00:00
  },
  (table) => [
    index("job_id_idx").on(table.job_id),
    index("run_at_idx").on(table.run_at),
  ]
);
