import { Suspense } from "react";
import { notFound } from "next/navigation";

import { type HabitFolder } from "@/components/profile/HabitFolderCard";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileView } from "@/components/profile/ProfileView";
import { FEATURES } from "@/lib/flags";
import { getCurrentUser } from "@/lib/user";

const DEMO_USER = {
  name: "You",
  handle: "you",
  joinedLabel: "here since jan 2026",
  initials: "YO",
};

const BIO = "trying to read more, scroll less. one small thing a day.";

const STATS = {
  currentStreak: 0,
  longestStreak: 0,
  activeDays: 0,
  totalDays: 371,
  heldBy: 142,
};

const FOLDERS: HabitFolder[] = [
  {
    id: "reading",
    name: "reading",
    icon: "book",
    tint: "terracotta",
    cadence: "daily",
    target: 20,
    entryCount: 42,
    lastEntryLabel: "yesterday",
  },
  {
    id: "morning-walk",
    name: "morning walk",
    icon: "walk",
    tint: "sage",
    cadence: "daily",
    target: null,
    entryCount: 18,
    lastEntryLabel: "2 days ago",
  },
  {
    id: "water",
    name: "water",
    icon: "water",
    tint: "sand",
    cadence: "daily",
    target: 8,
    entryCount: 60,
    lastEntryLabel: "today",
  },
];

async function ProfileContent() {
  const current = await getCurrentUser();
  const user = current ?? DEMO_USER;

  const header = {
    name: user.name,
    handle: user.handle,
    joinedLabel: user.joinedLabel,
    initials: user.initials,
    bio: BIO,
  };

  return <ProfileView user={header} stats={STATS} folders={FOLDERS} />;
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
