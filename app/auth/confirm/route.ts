import { createClient } from "@/lib/supabase/server";
import { withRLS } from "@/lib/db";
import { profilesTable } from "@/lib/db/schema";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/";
  // Only allow relative paths so the link can't bounce users to another site.
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
      ? rawNext
      : "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const user = data.user;
      if (user) {
        await withRLS({ sub: user.id }, (tx) =>
          tx
            .insert(profilesTable)
            .values({
              id: user.id,
              name: user.user_metadata.name ?? "",
              email: user.email!,
            })
            .onConflictDoNothing(),
        );
      }
      redirect(next);
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect(`/auth/error?error=No token hash or type`);
}
