ALTER TABLE "siginin_history" RENAME TO "signin_history";--> statement-breakpoint
ALTER TABLE "signin_history" DROP CONSTRAINT "siginin_history_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "signin_history" ADD CONSTRAINT "signin_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;