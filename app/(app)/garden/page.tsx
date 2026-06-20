import { Lock, Plus, Sprout } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { FEATURES } from "@/lib/flags";
import ActivityHeatmap from "@/components/ActivityHeatmap";

export default function GardenPage() {
  if (!FEATURES.garden) {
    notFound();
  }

  return (
    <div className="py-8 pl-8 pr-6 sm:pl-12 sm:pr-8 lg:pl-16">
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Garden
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-bg-alt px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <Lock className="h-3 w-3" aria-hidden />
          private
        </span>
      </div>

      <h1 className="mt-1 font-serif text-3xl tracking-tight text-foreground">
        tend your habits
      </h1>
      <p className="my-4 max-w-md text-sm text-muted-foreground">
        your private space to grow habits at your own pace. nothing here is
        shared unless you choose to post it.
      </p>

      <Suspense
        fallback={
          <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
        }
      >
        <ActivityHeatmap />
      </Suspense>

      <div className="mt-8 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
          <Sprout className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Nothing planted yet
          </p>
          <p className="text-sm text-muted-foreground">
            Add your first habit and start tending it.
          </p>
        </div>
        <Button className="rounded-full">
          <Plus strokeWidth={2.5} aria-hidden />
          Add a habit
        </Button>
      </div>
    </div>
  );
}
