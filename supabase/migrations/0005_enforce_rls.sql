ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "habit_entries" ALTER COLUMN "habit_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "habit_entries_habit_id_date_idx" ON "habit_entries" USING btree ("habit_id","date");--> statement-breakpoint
CREATE INDEX "habits_user_id_idx" ON "habits" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "users can view their own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = "profiles"."id");--> statement-breakpoint
CREATE POLICY "users can insert their own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = "profiles"."id");--> statement-breakpoint
CREATE POLICY "users can update their own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.uid() = "profiles"."id") WITH CHECK (auth.uid() = "profiles"."id");--> statement-breakpoint
ALTER POLICY "users can view their own habit entries" ON "habit_entries" TO authenticated USING (exists (select 1 from "habits" where "habits"."id" = "habit_entries"."habit_id" and "habits"."user_id" = auth.uid()));--> statement-breakpoint
ALTER POLICY "users can insert their own habit entries" ON "habit_entries" TO authenticated WITH CHECK (exists (select 1 from "habits" where "habits"."id" = "habit_entries"."habit_id" and "habits"."user_id" = auth.uid()));--> statement-breakpoint
ALTER POLICY "users can update their own habit entries" ON "habit_entries" TO authenticated USING (exists (select 1 from "habits" where "habits"."id" = "habit_entries"."habit_id" and "habits"."user_id" = auth.uid())) WITH CHECK (exists (select 1 from "habits" where "habits"."id" = "habit_entries"."habit_id" and "habits"."user_id" = auth.uid()));--> statement-breakpoint
ALTER POLICY "users can delete their own habit entries" ON "habit_entries" TO authenticated USING (exists (select 1 from "habits" where "habits"."id" = "habit_entries"."habit_id" and "habits"."user_id" = auth.uid()));