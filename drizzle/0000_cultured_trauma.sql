CREATE TYPE "public"."http_method" AS ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('active', 'paused', 'failed', 'completed');--> statement-breakpoint
CREATE TABLE "job_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"status_code" integer,
	"response_body" text,
	"error_message" text,
	"duration_ms" integer,
	"retry_count" integer DEFAULT 0,
	"success" boolean DEFAULT false NOT NULL,
	"run_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"method" "http_method" DEFAULT 'GET' NOT NULL,
	"headers" json,
	"body" json,
	"cron_expression" text,
	"interval_seconds" integer,
	"timeout_ms" integer DEFAULT 10000,
	"max_retries" integer DEFAULT 3,
	"retry_delay_seconds" integer DEFAULT 60,
	"consecutive_failures" integer DEFAULT 0,
	"status" "job_status" DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"last_success_at" timestamp,
	"last_failure_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "job_logs" ADD CONSTRAINT "job_logs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_id_idx" ON "job_logs" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "run_at_idx" ON "job_logs" USING btree ("run_at");--> statement-breakpoint
CREATE INDEX "next_run_idx" ON "jobs" USING btree ("next_run_at");--> statement-breakpoint
CREATE INDEX "status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "jobs" USING btree ("user_id");