import { ArrowLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WEEKDAY_INITIALS } from "@/lib/dates";

const STAT_LABELS = ["current streak", "longest streak", "entries"] as const;

const CALENDAR_CELLS = Array.from({ length: 35 }, (_, i) => i);

export function HabitSkeleton() {
  return (
    <div
      className="w-full pb-12 pt-8 lg:px-6 lg:pt-4"
      role="status"
      aria-label="Loading habit"
    >
      <div className="space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] lowercase tracking-wide text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            garden
          </span>
          <Skeleton className="mt-3 h-8 w-44 sm:h-9 sm:w-56" />
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {STAT_LABELS.map((label) => (
            <Card
              key={label}
              className="rounded-2xl border-border/70 p-4 shadow-sm"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-3 w-10" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/70 p-5 shadow-sm lg:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                today
              </p>
              <h2 className="mt-1.5 font-serif text-xl tracking-tight text-foreground">
                what grew today?
              </h2>
              <Skeleton className="mt-4 h-36 w-full rounded-md" />
              <Skeleton className="mt-4 h-10 w-24 rounded-full" />
            </Card>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                earlier
              </h2>
              <div className="mt-3 space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </div>

          <Card className="h-fit rounded-2xl border-border/70 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {WEEKDAY_INITIALS.map((initial, index) => (
                <span
                  key={index}
                  aria-hidden
                  className="pb-1 text-center font-mono text-[10px] lowercase text-muted-foreground"
                >
                  {initial}
                </span>
              ))}
              {CALENDAR_CELLS.map((i) => (
                <span key={i} className="aspect-square rounded-lg bg-[#efe7db]" />
              ))}
            </div>
          </Card>
        </div>
      </div>
      <span className="sr-only">Loading habit</span>
    </div>
  );
}
