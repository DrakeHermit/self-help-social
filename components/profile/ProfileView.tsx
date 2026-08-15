import { Suspense } from "react";
import { Plus, Sprout } from "lucide-react";

import ActivityHeatmap from "@/components/ActivityHeatmap";
import { Button } from "@/components/ui/button";
import { ProfileHeader, type ProfileHeaderProps } from "./ProfileHeader";
import { HeatmapSkeleton } from "./ProfileSkeleton";
import { ProfileStats, type ProfileStatsProps } from "./ProfileStats";
import { ProfileTabs } from "./ProfileTabs";

export type ProfileViewProps = {
  user: ProfileHeaderProps;
  stats: ProfileStatsProps;
};

function GardenEmptyState() {
  return (
    <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
        <Sprout className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">nothing planted yet</p>
        <p className="text-sm text-muted-foreground">
          add your first habit and start tending it.
        </p>
      </div>
      <Button className="rounded-full lowercase">
        <Plus strokeWidth={2.5} aria-hidden />
        add a habit
      </Button>
    </div>
  );
}

export function ProfileView({ user, stats }: ProfileViewProps) {
  return (
    <div className="w-full pb-12 pt-8 lg:px-4 lg:pt-4">
      <div className="space-y-6">
        <ProfileHeader {...user} />

        <ProfileStats {...stats} />

        <Suspense fallback={<HeatmapSkeleton />}>
          <ActivityHeatmap />
        </Suspense>

        <ProfileTabs garden={<GardenEmptyState />} />
      </div>
    </div>
  );
}
