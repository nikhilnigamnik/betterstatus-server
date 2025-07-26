ALTER TABLE "endpoint" ALTER COLUMN "check_interval_seconds" SET DEFAULT 60;--> statement-breakpoint
ALTER TABLE "endpoint" ADD COLUMN "last_checked_at" timestamp;--> statement-breakpoint
ALTER TABLE "endpoint" ADD COLUMN "next_check_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoint" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "endpoint" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "monitor_logs" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "monitor_logs" DROP COLUMN "updated_at";