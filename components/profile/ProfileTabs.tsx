"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type TabId = "garden" | "posts";

const TABS: { id: TabId; label: string }[] = [
  { id: "garden", label: "garden" },
  { id: "posts", label: "posts" },
];

const PLACEHOLDER_COPY: Record<Exclude<TabId, "garden">, string> = {
  posts: "quiet posts you've chosen to share will show up here.",
};

export type ProfileTabsProps = {
  garden: React.ReactNode;
};

export function ProfileTabs({ garden }: ProfileTabsProps) {
  const [active, setActive] = useState<TabId>("garden");

  return (
    <div>
      <div
        role="tablist"
        aria-label="profile sections"
        className="flex items-center gap-6 border-b border-border/70"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={cn(
                "-mb-px border-b-2 pb-3 pt-1 text-sm lowercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-6">
        {active === "garden" ? (
          garden
        ) : (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {PLACEHOLDER_COPY[active]}
          </p>
        )}
      </div>
    </div>
  );
}
