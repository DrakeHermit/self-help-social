import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { profilesTable } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  handle: string;
  joinedLabel: string;
  createdAt: Date;
};

function formatJoinedLabel(createdAt: Date): string {
  const label = createdAt.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  return `here since ${label}`.toLowerCase();
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) return null;

  const userId = claims.sub as string;
  const claimEmail = (claims.email as string | undefined) ?? "";
  const claimName = (claims.user_metadata as { name?: string } | undefined)
    ?.name;

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, userId))
    .limit(1);

  const email = profile?.email ?? claimEmail;
  const localPart = email.split("@")[0] ?? "";
  const name = profile?.name || claimName || localPart;
  const createdAt = profile?.createdAt ?? new Date();

  return {
    id: userId,
    name,
    email,
    initials: getInitials(email),
    handle: localPart,
    joinedLabel: formatJoinedLabel(createdAt),
    createdAt,
  };
});
