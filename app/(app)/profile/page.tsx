import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileView } from "@/components/profile/ProfileView";
import { FEATURES } from "@/lib/flags";
import { getHabitFolders, getHabitStats } from "@/lib/habits";
import { getCurrentUser } from "@/lib/user";

const DEMO_USER = {
  name: "You",
  handle: "you",
  joinedLabel: "here since jan 2026",
  initials: "YO",
};

const BIO = "trying to read more, scroll less. one small thing a day.";

const EMPTY_STATS = {
  currentStreak: 0,
  longestStreak: 0,
  activeDays: 0,
  totalDays: 365,
  heldBy: 0,
};

async function ProfileContent() {
  const current = await getCurrentUser();
  const user = current ?? DEMO_USER;

  const [folders, stats] = current
    ? await Promise.all([
        getHabitFolders(current.id),
        getHabitStats(current.id, new Date().getFullYear()),
      ])
    : [[], EMPTY_STATS];

  const header = {
    name: user.name,
    handle: user.handle,
    joinedLabel: user.joinedLabel,
    initials: user.initials,
    bio: BIO,
  };

  return (
    <ProfileView
      user={header}
      stats={stats}
      folders={folders}
      userId={current?.id}
    />
  );
}

export default function ProfilePage() {
  if (!FEATURES.garden) {
    notFound();
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
