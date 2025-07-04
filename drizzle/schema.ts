import { pgTable, index, foreignKey, uuid, text, json, integer, boolean, timestamp, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const httpMethod = pgEnum("http_method", ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
export const jobStatus = pgEnum("job_status", ['active', 'paused', 'failed', 'completed'])


export const jobs = pgTable("jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	url: text().notNull(),
	method: httpMethod().default('GET').notNull(),
	headers: json(),
	body: json(),
	cronExpression: text("cron_expression"),
	intervalSeconds: integer("interval_seconds"),
	timeoutMs: integer("timeout_ms").default(10000),
	maxRetries: integer("max_retries").default(3),
	retryDelaySeconds: integer("retry_delay_seconds").default(60),
	consecutiveFailures: integer("consecutive_failures").default(0),
	status: jobStatus().default('active').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	lastRunAt: timestamp("last_run_at", { mode: 'string' }),
	nextRunAt: timestamp("next_run_at", { mode: 'string' }),
	lastSuccessAt: timestamp("last_success_at", { mode: 'string' }),
	lastFailureAt: timestamp("last_failure_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("next_run_idx").using("btree", table.nextRunAt.asc().nullsLast().op("timestamp_ops")),
	index("status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "jobs_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const jobLogs = pgTable("job_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	jobId: uuid("job_id").notNull(),
	statusCode: integer("status_code"),
	responseBody: text("response_body"),
	errorMessage: text("error_message"),
	durationMs: integer("duration_ms"),
	retryCount: integer("retry_count").default(0),
	success: boolean().default(false).notNull(),
	runAt: timestamp("run_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("job_id_idx").using("btree", table.jobId.asc().nullsLast().op("uuid_ops")),
	index("run_at_idx").using("btree", table.runAt.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [jobs.id],
			name: "job_logs_job_id_jobs_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('user').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	isVerified: boolean("is_verified").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const waitlist = pgTable("waitlist", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("waitlist_email_unique").on(table.email),
]);
