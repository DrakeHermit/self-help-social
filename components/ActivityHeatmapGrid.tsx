"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  countToLevel,
  MONTH_NAMES,
  type GridCell,
  type Level,
} from "@/lib/heatmap";

const LEVEL_CLASSES: Record<Level, string> = {
  0: "bg-[#efe7db]",
  1: "bg-[#f3d9c6]",
  2: "bg-[#e3b48d]",
  3: "bg-[#cd8a5c]",
  4: "bg-[#a85c33]",
  5: "bg-[#6f3f23]",
};

const LEGEND_LEVELS: Level[] = [0, 1, 2, 3, 4, 5];

const WEEKDAY_LABELS = ["", "mon", "", "wed", "", "fri", ""];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

function todayISO(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function computeStats(weeks: GridCell[][]): {
  activeDays: number;
  longestStreak: number;
} {
  const active = new Set<string>();
  for (const week of weeks) {
    for (const day of week) {
      if (day && day.count > 0) active.add(day.date);
    }
  }

  let longestStreak = 0;
  let run = 0;
  const sorted = [...active].sort();
  let previous: number | null = null;
  for (const iso of sorted) {
    const time = new Date(`${iso}T00:00:00`).getTime();
    if (previous !== null && time - previous === 86_400_000) {
      run += 1;
    } else {
      run = 1;
    }
    longestStreak = Math.max(longestStreak, run);
    previous = time;
  }

  return { activeDays: active.size, longestStreak };
}

type Props = {
  weeks: GridCell[][];
  monthLabels: string[];
};

export default function ActivityHeatmapGrid({ weeks, monthLabels }: Props) {
  const { activeDays, longestStreak } = computeStats(weeks);
  const today = todayISO();

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full">
        <div className="flex gap-1.5">
          <div className="w-9 shrink-0" aria-hidden />
          <div className="grid flex-1 grid-flow-col auto-cols-fr gap-1">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="font-mono text-[10px] uppercase tracking-wide leading-none text-muted-foreground"
              >
                <span className="whitespace-nowrap">{label}</span>
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
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) =>
                day ? (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "aspect-square w-full rounded-[4px]",
                          LEVEL_CLASSES[countToLevel(day.count)],
                          day.date === today &&
                            "ring-1 ring-foreground/50 ring-offset-1 ring-offset-card",
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{formatDate(day.date)}</p>
                      <p className="text-muted-foreground">
                        {day.count === 0
                          ? "nothing planted"
                          : `${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div
                    key={`pad-${weekIndex}-${dayIndex}`}
                    className="aspect-square w-full"
                  />
                ),
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted-foreground">
          {activeDays} active days · longest streak {longestStreak} days
        </p>
        <div className="flex items-center gap-1.5 font-mono text-[11px] lowercase text-muted-foreground">
          <span>less</span>
          {LEGEND_LEVELS.map((level) => (
            <span
              key={level}
              className={cn("h-3.5 w-3.5 rounded-[3px]", LEVEL_CLASSES[level])}
            />
          ))}
          <span>more</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
