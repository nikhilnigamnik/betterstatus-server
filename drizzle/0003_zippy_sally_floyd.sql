CREATE TABLE "siginin_history" (
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
ALTER TABLE "siginin_history" ADD CONSTRAINT "siginin_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;