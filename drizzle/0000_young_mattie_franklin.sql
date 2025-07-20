CREATE TYPE "public"."auth_provider" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."check_status" AS ENUM('success', 'failure', 'timeout', 'error');--> statement-breakpoint
CREATE TYPE "public"."endpoint_method" AS ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE');--> statement-breakpoint
CREATE TYPE "public"."incident_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('open', 'investigating', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'member', 'admin');--> statement-breakpoint
CREATE TABLE "cron_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"bullmq_job_id" varchar(255),
	"cron_expression" varchar(100),
	"interval_seconds" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cron_job_bullmq_job_id_unique" UNIQUE("bullmq_job_id")
);
--> statement-breakpoint
CREATE TABLE "job_execution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cron_job_id" uuid NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"status" "job_status" NOT NULL,
	"execution_time_ms" integer,
	"error_message" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "incident" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid NOT NULL,
	"endpoint_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "incident_status" DEFAULT 'open' NOT NULL,
	"severity" "incident_severity" DEFAULT 'medium' NOT NULL,
	"started_at" timestamp NOT NULL,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"message" text NOT NULL,
	"status" "incident_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "endpoint" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"path" text NOT NULL,
	"method" "endpoint_method" DEFAULT 'GET' NOT NULL,
	"headers" jsonb,
	"request_body" jsonb,
	"expected_status_code" integer DEFAULT 200 NOT NULL,
	"expected_response_content" jsonb,
	"timeout_seconds" integer DEFAULT 30 NOT NULL,
	"check_interval_seconds" integer DEFAULT 300 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monitor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"base_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monitor_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"status" "check_status" NOT NULL,
	"response_time_ms" integer,
	"http_status_code" integer,
	"response_body" text,
	"error_message" text,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"incident_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"logo_url" text,
	"custom_domain" varchar(255),
	"is_public" boolean DEFAULT true NOT NULL,
	"is_password_protected" boolean DEFAULT false NOT NULL,
	"password" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "status_page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "status_page_endpoint" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status_page_id" uuid NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_page_monitor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status_page_id" uuid NOT NULL,
	"monitor_id" uuid NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_checks" integer DEFAULT 0 NOT NULL,
	"successful_checks" integer DEFAULT 0 NOT NULL,
	"failed_checks" integer DEFAULT 0 NOT NULL,
	"avg_response_time_ms" integer,
	"max_response_time_ms" integer,
	"error_rate" numeric(5, 2),
	"incidents_created" integer DEFAULT 0 NOT NULL,
	"monitors_active" integer DEFAULT 0 NOT NULL,
	"downtime_duration_ms" integer DEFAULT 0 NOT NULL,
	"retries_triggered" integer DEFAULT 0 NOT NULL,
	"cron_jobs_executed" integer DEFAULT 0 NOT NULL,
	"notifications_sent" integer DEFAULT 0 NOT NULL,
	"status_page_views" integer DEFAULT 0 NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"name" varchar(100),
	"avatar_url" text,
	"auth_provider" "auth_provider" DEFAULT 'email' NOT NULL,
	"provider_id" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified_at" timestamp,
	"last_login_at" timestamp,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cron_job" ADD CONSTRAINT "cron_job_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_execution" ADD CONSTRAINT "job_execution_cron_job_id_cron_job_id_fk" FOREIGN KEY ("cron_job_id") REFERENCES "public"."cron_job"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_execution" ADD CONSTRAINT "job_execution_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_updates" ADD CONSTRAINT "incident_updates_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoint" ADD CONSTRAINT "endpoint_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor" ADD CONSTRAINT "monitor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_logs" ADD CONSTRAINT "monitor_logs_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_logs" ADD CONSTRAINT "monitor_logs_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page" ADD CONSTRAINT "status_page_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page_endpoint" ADD CONSTRAINT "status_page_endpoint_status_page_id_status_page_id_fk" FOREIGN KEY ("status_page_id") REFERENCES "public"."status_page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page_endpoint" ADD CONSTRAINT "status_page_endpoint_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page_monitor" ADD CONSTRAINT "status_page_monitor_status_page_id_status_page_id_fk" FOREIGN KEY ("status_page_id") REFERENCES "public"."status_page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page_monitor" ADD CONSTRAINT "status_page_monitor_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_metrics" ADD CONSTRAINT "usage_metrics_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cron_job_endpoint_id_idx" ON "cron_job" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "cron_job_next_run_at_idx" ON "cron_job" USING btree ("next_run_at");--> statement-breakpoint
CREATE INDEX "job_execution_cron_job_id_idx" ON "job_execution" USING btree ("cron_job_id");--> statement-breakpoint
CREATE INDEX "job_execution_endpoint_id_idx" ON "job_execution" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "job_execution_executed_at_idx" ON "job_execution" USING btree ("executed_at");--> statement-breakpoint
CREATE INDEX "incident_monitor_id_idx" ON "incident" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "incident_endpoint_id_idx" ON "incident" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "incident_status_idx" ON "incident" USING btree ("status");--> statement-breakpoint
CREATE INDEX "incident_started_at_idx" ON "incident" USING btree ("started_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "incident_updates_incident_id_idx" ON "incident_updates" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "incident_updates_created_at_idx" ON "incident_updates" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "endpoint_monitor_id_idx" ON "endpoint" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "endpoint_monitor_active_idx" ON "endpoint" USING btree ("monitor_id","is_active");--> statement-breakpoint
CREATE INDEX "monitor_user_id_idx" ON "monitor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monitor_base_url_idx" ON "monitor" USING btree ("base_url");--> statement-breakpoint
CREATE INDEX "monitor_id_idx" ON "monitor" USING btree ("id");--> statement-breakpoint
CREATE INDEX "monitor_logs_endpoint_id_idx" ON "monitor_logs" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "monitor_logs_endpoint_checked_idx" ON "monitor_logs" USING btree ("endpoint_id","checked_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "monitor_logs_incident_id_idx" ON "monitor_logs" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "monitor_logs_checked_at_idx" ON "monitor_logs" USING btree ("checked_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "status_page_user_id_idx" ON "status_page" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "status_page_slug_idx" ON "status_page" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "status_page_custom_domain_idx" ON "status_page" USING btree ("custom_domain");--> statement-breakpoint
CREATE INDEX "status_page_is_public_idx" ON "status_page" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "spe_status_page_id_idx" ON "status_page_endpoint" USING btree ("status_page_id");--> statement-breakpoint
CREATE INDEX "spe_endpoint_id_idx" ON "status_page_endpoint" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "spe_status_page_order_idx" ON "status_page_endpoint" USING btree ("status_page_id","display_order");--> statement-breakpoint
CREATE INDEX "spm_status_page_id_idx" ON "status_page_monitor" USING btree ("status_page_id");--> statement-breakpoint
CREATE INDEX "spm_monitor_id_idx" ON "status_page_monitor" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "spm_status_page_order_idx" ON "status_page_monitor" USING btree ("status_page_id","display_order");--> statement-breakpoint
CREATE INDEX "user_date_idx" ON "usage_metrics" USING btree ("user_id","date");