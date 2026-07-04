import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { ProfileView } from "@/components/profile/ProfileView";
import { FEATURES } from "@/lib/flags";
import { getCurrentUser } from "@/lib/user";

async function ProfileContent() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <ProfileView
      user={{
        name: user.name,
        handle: user.handle,
        joinedLabel: user.joinedLabel,
        initials: user.initials,
      }}
    />
  );
}

export default function ProfilePage() {
  if (!FEATURES.garden) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
