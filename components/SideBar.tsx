"use client";

import { Plus, Settings } from "lucide-react";

export const SideBar = () => {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-white/5 bg-[#2a221b] text-[#f1e7d9] md:flex">
      <div className="p-4">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium lowercase text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          quick check-in
        </button>
      </div>

      <div className="flex-1" />

      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 px-1 py-1">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground"
          >
            YO
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-[#f5ece0]">
              You
            </span>
            <span className="truncate text-xs text-[#8a7b69]">@you</span>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8a7b69] transition-colors hover:bg-white/5 hover:text-[#f5ece0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <Settings
              className="h-4 w-4"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </aside>
  );
};
