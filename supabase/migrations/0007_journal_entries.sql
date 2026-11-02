CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "journal_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "journal_entries_user_id_created_at_idx" ON "journal_entries" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE POLICY "users can view their own journal entries" ON "journal_entries" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = "journal_entries"."user_id");--> statement-breakpoint
CREATE POLICY "users can insert their own journal entries" ON "journal_entries" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = "journal_entries"."user_id");--> statement-breakpoint
CREATE POLICY "users can update their own journal entries" ON "journal_entries" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.uid() = "journal_entries"."user_id") WITH CHECK (auth.uid() = "journal_entries"."user_id");--> statement-breakpoint
CREATE POLICY "users can delete their own journal entries" ON "journal_entries" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.uid() = "journal_entries"."user_id");