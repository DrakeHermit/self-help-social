import { Settings, Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export type ProfileHeaderProps = {
  name: string;
  handle: string;
  joinedLabel: string;
  initials: string;
  bio?: string;
};

export function ProfileHeader({
  name,
  handle,
  joinedLabel,
  initials,
  bio,
}: ProfileHeaderProps) {
  return (
    <header className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
      <div className="h-28 w-full bg-gradient-to-r from-[#f1e2d3] via-[#efe7db] to-[#dfe3d6]" />

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="size-24 shrink-0 ring-4 ring-card">
              <AvatarFallback className="bg-primary font-serif text-2xl font-medium uppercase tracking-wide text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 sm:pb-1">
              <h1 className="font-serif text-3xl leading-none tracking-tight text-foreground">
                {name}
              </h1>
              <p className="font-mono text-xs lowercase text-muted-foreground">
                @{handle} · {joinedLabel}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full lowercase"
            >
              <Settings strokeWidth={1.75} aria-hidden />
              edit
            </Button>
            <Button type="button" className="rounded-full lowercase">
              <Plus strokeWidth={2.25} aria-hidden />
              share streak
            </Button>
          </div>
        </div>

        {bio ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {bio}
          </p>
        ) : null}
      </div>
    </header>
  );
}
