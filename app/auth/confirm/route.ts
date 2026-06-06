import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profilesTable } from "@/lib/db/schema";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const user = data.user;
      if (user) {
        await db
          .insert(profilesTable)
          .values({
            id: user.id,
            name: user.user_metadata.name ?? "",
            email: user.email!,
          })
          .onConflictDoNothing(); // confirm link may be hit more than once
      }
      // redirect user to specified redirect URL or root of app
      redirect(next);
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=No token hash or type`);
}
