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
  joinedLabel,
  initials,
  bio,
}: ProfileHeaderProps) {
  return (
    <header className="-mx-4 -mt-12 overflow-hidden rounded-none border border-border/70 border-x-0 border-t-0 bg-card shadow-sm lg:mx-0 lg:mt-0 lg:rounded-3xl lg:border-x lg:border-t">
      <div className="h-28 w-full bg-gradient-to-r from-[#f1e2d3] via-[#efe7db] to-[#dfe3d6]" />

      <div className="px-4 pb-5 md:px-5 sm:px-6 sm:pb-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-4">
            <Avatar className="size-20 shrink-0 ring-4 ring-card sm:size-24">
              <AvatarFallback className="bg-primary font-serif text-2xl font-medium uppercase tracking-wide text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="mt-6 min-w-0 sm:pb-1">
              <h1 className="font-serif text-2xl leading-none tracking-tight text-foreground sm:text-3xl">
                {name}
              </h1>
              <p className="mt-1.5 truncate font-mono text-xs lowercase text-muted-foreground">
                {joinedLabel}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full lowercase sm:flex-none"
            >
              <Settings strokeWidth={1.75} aria-hidden />
              edit
            </Button>
            <Button
              type="button"
              className="flex-[2] rounded-full lowercase sm:flex-none"
            >
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
