CREATE TYPE "public"."monitor_http_method" AS ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS');--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "http_method" "monitor_http_method" DEFAULT 'GET' NOT NULL;--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "headers" json;--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "request_body" json;--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "expected_status_code" integer DEFAULT 200 NOT NULL;