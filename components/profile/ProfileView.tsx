import { Suspense } from "react";

import ActivityHeatmap from "@/components/ActivityHeatmap";
import { ProfileHeader, type ProfileHeaderProps } from "./ProfileHeader";

export type ProfileViewProps = {
  user: ProfileHeaderProps;
};

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="w-full px-4 pb-4 pt-8 sm:px-10 md:pb-12 lg:px-12">
      <div className="space-y-6">
        <ProfileHeader {...user} />

        <Suspense
          fallback={
            <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
          }
        >
          <ActivityHeatmap />
        </Suspense>
      </div>
    </div>
  );
}
