"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { countToLevel, MONTH_NAMES, type GridCell, type Level } from "@/lib/heatmap";

const LEVEL_CLASSES: Record<Level, string> = {
  0: "bg-muted",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/60",
  4: "bg-primary/80",
  5: "bg-primary",
};

const LEGEND_LEVELS: Level[] = [0, 1, 2, 3, 4, 5];

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

type Props = {
  weeks: GridCell[][];
  monthLabels: string[];
};

export default function ActivityHeatmapGrid({ weeks, monthLabels }: Props) {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="overflow-x-auto pb-2">
        <div className="w-max">
          <div className="flex gap-1">
            <div className="w-8 shrink-0" aria-hidden />
            <div className="grid grid-flow-col grid-rows-1 gap-1">
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="w-3 text-[10px] leading-none text-muted-foreground"
                >
                  <span className="whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-1 flex gap-1">
            <div className="grid w-8 shrink-0 grid-rows-[repeat(7,minmax(0,1fr))] gap-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex h-3 items-center text-[10px] leading-none text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-[repeat(7,minmax(0,1fr))] gap-1">
              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) =>
                  day ? (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-3 w-3 shrink-0 rounded-sm",
                            LEVEL_CLASSES[countToLevel(day.count)],
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{formatDate(day.date)}</p>
                        <p className="text-muted-foreground">
                          {day.count === 0
                            ? "No entries"
                            : `${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div
                      key={`pad-${weekIndex}-${dayIndex}`}
                      className="h-3 w-3 shrink-0"
                    />
                  ),
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        {LEGEND_LEVELS.map((level) => (
          <span
            key={level}
            className={cn("h-3 w-3 rounded-sm", LEVEL_CLASSES[level])}
          />
        ))}
        <span>More</span>
      </div>
    </TooltipProvider>
  );
}
