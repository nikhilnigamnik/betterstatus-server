CREATE TYPE "public"."auth_provider" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."incident_severity" AS ENUM('minor', 'major', 'critical');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('investigating', 'identified', 'monitoring', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."monitor_http_method" AS ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS');--> statement-breakpoint
CREATE TYPE "public"."monitor_status" AS ENUM('success', 'failure', 'timeout', 'error');--> statement-breakpoint
CREATE TYPE "public"."plan_name" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'past_due');--> statement-breakpoint
CREATE TYPE "public"."system_status" AS ENUM('operational', 'degraded_performance', 'partial_outage', 'major_outage', 'under_maintenance');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'member', 'admin');--> statement-breakpoint
CREATE TABLE "incident" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "incident_status" DEFAULT 'investigating' NOT NULL,
	"severity" "incident_severity" DEFAULT 'minor' NOT NULL,
	"started_at" timestamp NOT NULL,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "incident_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"user_id" uuid,
	"status" "incident_status" NOT NULL,
	"message" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "monitor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar(255) NOT NULL,
	"image_url" text,
	"description" text,
	"base_url" text NOT NULL,
	"http_method" "monitor_http_method" DEFAULT 'GET' NOT NULL,
	"headers" json,
	"request_body" json,
	"expected_status_code" integer DEFAULT 200 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"check_interval" integer DEFAULT 90 NOT NULL,
	"last_check_at" timestamp,
	"next_check_at" timestamp DEFAULT now() NOT NULL,
	"email_notifications" boolean DEFAULT false NOT NULL,
	"slack_notifications" boolean DEFAULT false NOT NULL,
	"teams_notifications" boolean DEFAULT false NOT NULL,
	"discord_notifications" boolean DEFAULT false NOT NULL,
	"slack_webhook_url" text,
	"teams_webhook_url" text,
	"discord_webhook_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monitor_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid,
	"status" "monitor_status" NOT NULL,
	"status_code" integer,
	"response_time" integer,
	"response_body" json,
	"error_message" text,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "plan_name" DEFAULT 'free' NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"billing_cycle" "billing_cycle" DEFAULT 'monthly',
	"max_monitors" integer DEFAULT 1 NOT NULL,
	"max_status_pages" integer DEFAULT 1 NOT NULL,
	"max_members" integer DEFAULT 2 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signin_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"ip_address" text NOT NULL,
	"os" text NOT NULL,
	"browser" text NOT NULL,
	"device" text NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"region" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"favicon_url" text,
	"custom_domain" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"status" "system_status" DEFAULT 'operational' NOT NULL,
	"status_message" text,
	"last_status_change_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_page_monitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status_page_id" uuid NOT NULL,
	"monitor_id" uuid NOT NULL,
	"display_name" varchar(255),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL
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
	"last_signed_in_at" timestamp,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"cancelled_at" timestamp,
	"stripe_subscription_id" varchar(255),
	"stripe_customer_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_updates" ADD CONSTRAINT "incident_updates_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_updates" ADD CONSTRAINT "incident_updates_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor" ADD CONSTRAINT "monitor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_logs" ADD CONSTRAINT "monitor_logs_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signin_history" ADD CONSTRAINT "signin_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page" ADD CONSTRAINT "status_page_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page_monitors" ADD CONSTRAINT "status_page_monitors_status_page_id_status_page_id_fk" FOREIGN KEY ("status_page_id") REFERENCES "public"."status_page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_page_monitors" ADD CONSTRAINT "status_page_monitors_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_plan" ADD CONSTRAINT "user_plan_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_plan" ADD CONSTRAINT "user_plan_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "incident_monitor_id_idx" ON "incident" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "incident_status_idx" ON "incident" USING btree ("status");--> statement-breakpoint
CREATE INDEX "incident_severity_idx" ON "incident" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "incident_started_at_idx" ON "incident" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "incident_resolved_at_idx" ON "incident" USING btree ("resolved_at");--> statement-breakpoint
CREATE INDEX "incident_deleted_at_idx" ON "incident" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "incident_updates_incident_id_idx" ON "incident_updates" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "incident_updates_user_id_idx" ON "incident_updates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "incident_updates_status_idx" ON "incident_updates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "incident_updates_created_at_idx" ON "incident_updates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "incident_updates_is_public_idx" ON "incident_updates" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "incident_updates_deleted_at_idx" ON "incident_updates" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "monitor_user_id_idx" ON "monitor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monitor_is_active_idx" ON "monitor" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "monitor_is_archived_idx" ON "monitor" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX "monitor_check_interval_idx" ON "monitor" USING btree ("check_interval");--> statement-breakpoint
CREATE INDEX "monitor_last_check_at_idx" ON "monitor" USING btree ("last_check_at");--> statement-breakpoint
CREATE INDEX "monitor_next_check_at_idx" ON "monitor" USING btree ("next_check_at");--> statement-breakpoint
CREATE INDEX "monitor_user_active_idx" ON "monitor" USING btree ("user_id","is_active");--> statement-breakpoint
CREATE INDEX "monitor_next_check_active_idx" ON "monitor" USING btree ("next_check_at","is_active");--> statement-breakpoint
CREATE INDEX "monitor_logs_monitor_id_idx" ON "monitor_logs" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "monitor_logs_status_idx" ON "monitor_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "monitor_logs_checked_at_idx" ON "monitor_logs" USING btree ("checked_at");--> statement-breakpoint
CREATE INDEX "monitor_logs_deleted_at_idx" ON "monitor_logs" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "monitor_logs_monitor_checked_idx" ON "monitor_logs" USING btree ("monitor_id","checked_at");--> statement-breakpoint
CREATE INDEX "monitor_logs_status_checked_idx" ON "monitor_logs" USING btree ("status","checked_at");--> statement-breakpoint
CREATE INDEX "monitor_logs_monitor_status_idx" ON "monitor_logs" USING btree ("monitor_id","status");--> statement-breakpoint
CREATE INDEX "status_page_user_id_idx" ON "status_page" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "status_page_is_public_idx" ON "status_page" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "status_page_status_idx" ON "status_page" USING btree ("status");--> statement-breakpoint
CREATE INDEX "status_page_monitors_status_page_id_idx" ON "status_page_monitors" USING btree ("status_page_id");--> statement-breakpoint
CREATE INDEX "status_page_monitors_monitor_id_idx" ON "status_page_monitors" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "status_page_monitors_display_order_idx" ON "status_page_monitors" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "status_page_monitors_is_public_idx" ON "status_page_monitors" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_plan_user_id_idx" ON "user_plan" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_plan_plan_id_idx" ON "user_plan" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "user_plan_status_idx" ON "user_plan" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_plan_expires_at_idx" ON "user_plan" USING btree ("expires_at");