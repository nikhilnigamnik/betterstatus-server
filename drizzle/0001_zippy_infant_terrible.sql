ALTER TABLE "monitor" ALTER COLUMN "check_interval" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "monitor" ALTER COLUMN "check_interval" SET DEFAULT '90';