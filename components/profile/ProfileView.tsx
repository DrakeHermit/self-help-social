import { Suspense } from "react";

import ActivityHeatmap from "@/components/ActivityHeatmap";
import { ProfileHeader, type ProfileHeaderProps } from "./ProfileHeader";

export type ProfileViewProps = {
  user: ProfileHeaderProps;
};

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="w-full pb-4 pt-4 md:pb-4 lg:px-4">
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
