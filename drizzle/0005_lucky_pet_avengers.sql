ALTER TABLE "incident" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "incident_updates" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "monitor_logs" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "incident_deleted_at_idx" ON "incident" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "incident_updates_deleted_at_idx" ON "incident_updates" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "monitor_logs_deleted_at_idx" ON "monitor_logs" USING btree ("deleted_at");