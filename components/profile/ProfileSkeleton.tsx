import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MONTH_NAMES } from "@/lib/heatmap";

const STAT_LABELS = [
  "current streak",
  "longest streak",
  "active days",
  "held by",
] as const;

const WEEKDAY_LABELS = ["", "mon", "", "wed", "", "fri", ""] as const;
const HEATMAP_WEEKS = 53;
const HEATMAP_CELLS = Array.from(
  { length: HEATMAP_WEEKS * WEEKDAY_LABELS.length },
  (_, i) => i,
);

export function HeatmapSkeleton() {
  return (
    <Card className="-mx-4 rounded-none border-x-0 border-border/70 bg-card py-4 shadow-sm lg:mx-0 lg:w-full lg:rounded-2xl lg:border-x lg:p-6">
      <div className="flex items-baseline justify-between gap-4 px-4 lg:px-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          showing up
        </p>
        <Skeleton className="h-3 w-36 rounded-sm" />
      </div>
      <h2 className="mt-1.5 px-4 font-serif text-xl tracking-tight text-foreground sm:text-2xl lg:px-0">
        a year of small things
      </h2>

      <div className="mt-5 w-full overflow-x-auto px-4 pb-1 lg:px-0">
        <div className="min-w-[860px] animate-pulse">
          <div className="flex gap-1.5">
            <div className="w-9 shrink-0" aria-hidden />
            <div className="grid flex-1 grid-cols-12 gap-1">
              {MONTH_NAMES.map((label) => (
                <div
                  key={label}
                  className="font-mono text-[10px] uppercase leading-none tracking-wide text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-stretch gap-1.5">
            <div className="grid w-9 shrink-0 grid-rows-[repeat(7,minmax(0,1fr))] gap-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex items-center font-mono text-[10px] leading-none text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid flex-1 grid-flow-col grid-rows-[repeat(7,minmax(0,1fr))] auto-cols-fr gap-1">
              {HEATMAP_CELLS.map((i) => (
                <div
                  key={i}
                  className="aspect-square w-full rounded-[4px] bg-[#efe7db]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-4 lg:px-0">
        <Skeleton className="h-3 w-52 rounded-sm" />
        <div className="flex items-center gap-1.5 font-mono text-[11px] lowercase text-muted-foreground">
          <span>less</span>
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-[3px] bg-[#efe7db]"
            />
          ))}
          <span>more</span>
        </div>
      </div>
    </Card>
  );
}

export function ProfileSkeleton() {
  return (
    <div
      className="w-full pb-12 pt-8 lg:px-4 lg:pt-4"
      role="status"
      aria-label="Loading profile"
    >
      <div className="space-y-6">
        <header className="-mx-4 -mt-12 overflow-hidden rounded-none border border-border/70 border-x-0 border-t-0 bg-card shadow-sm lg:mx-0 lg:mt-0 lg:rounded-3xl lg:border-x lg:border-t">
          <div className="h-28 w-full bg-gradient-to-r from-[#f1e2d3] via-[#efe7db] to-[#dfe3d6]" />

          <div className="px-4 pb-5 md:px-5 sm:px-6 sm:pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 items-end gap-4">
                <Skeleton className="size-20 shrink-0 rounded-full ring-4 ring-card sm:size-24" />
                <div className="mt-6 min-w-0 sm:pb-1">
                  <Skeleton className="h-8 w-36 sm:h-9 sm:w-44" />
                  <Skeleton className="mt-2 h-3 w-40" />
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
                <Skeleton className="h-9 flex-1 rounded-full sm:w-[5.5rem] sm:flex-none" />
                <Skeleton className="h-9 flex-[2] rounded-full sm:w-[8.75rem] sm:flex-none" />
              </div>
            </div>

            <Skeleton className="mt-4 h-4 max-w-xl" />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {STAT_LABELS.map((label) => (
            <Card
              key={label}
              className="rounded-2xl border-border/70 p-4 shadow-sm"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-10" />
              </div>
            </Card>
          ))}
        </div>

        <HeatmapSkeleton />

        <div>
          <div className="flex items-center gap-6 border-b border-border/70">
            <span className="-mb-px border-b-2 border-primary pb-3 pt-1 text-sm font-medium lowercase text-foreground">
              garden
            </span>
            <span className="-mb-px border-b-2 border-transparent pb-3 pt-1 text-sm lowercase text-muted-foreground">
              posts
            </span>
          </div>
          <div className="pt-6">
            <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex w-full flex-col items-center gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading profile</span>
    </div>
  );
}
