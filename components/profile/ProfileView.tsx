import { Suspense } from "react";

import ActivityHeatmap from "@/components/ActivityHeatmap";
import { ProfileHeader, type ProfileHeaderProps } from "./ProfileHeader";
import { ProfileStats, type ProfileStatsProps } from "./ProfileStats";
import { ProfileTabs } from "./ProfileTabs";
import { HabitFolderGrid } from "./HabitFolderGrid";
import { type HabitFolder } from "./HabitFolderCard";

export type ProfileViewProps = {
  user: ProfileHeaderProps;
  stats: ProfileStatsProps;
  folders: HabitFolder[];
  userId?: string;
};

export function ProfileView({
  user,
  stats,
  folders,
  userId,
}: ProfileViewProps) {
  return (
    <div className="w-full pb-12 pt-8 lg:px-6 lg:pt-4">
      <div className="space-y-6">
        <ProfileHeader {...user} />

        <ProfileStats {...stats} />

        <Suspense
          fallback={
            <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
          }
        >
          <ActivityHeatmap userId={userId} />
        </Suspense>

        <ProfileTabs garden={<HabitFolderGrid folders={folders} />} />
      </div>
    </div>
  );
}
