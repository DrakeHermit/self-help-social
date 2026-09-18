"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  MONTH_NAMES_LONG,
  WEEKDAY_INITIALS,
  dayNumber,
  monthGrid,
  parseISODate,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

export type HabitCalendarProps = {
  writtenDates: Set<string>;
  selected: string;
  today: string;
  onSelect: (date: string) => void;
};

export function HabitCalendar({
  writtenDates,
  selected,
  today,
  onSelect,
}: HabitCalendarProps) {
  const selectedDate = parseISODate(selected);
  const [view, setView] = useState({
    year: selectedDate.getFullYear(),
    month: selectedDate.getMonth(),
  });

  const cells = monthGrid(view.year, view.month);
  const todayNumber = dayNumber(today);
  const todayDate = parseISODate(today);
  const atCurrentMonth =
    view.year === todayDate.getFullYear() &&
    view.month === todayDate.getMonth();

  function shiftMonth(by: number) {
    setView((current) => {
      const next = new Date(current.year, current.month + by, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="previous month"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <p
          aria-live="polite"
          className="font-mono text-[11px] lowercase tracking-wide text-muted-foreground"
        >
          {MONTH_NAMES_LONG[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={atCurrentMonth}
          aria-label="next month"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
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

        {cells.map((date, index) => {
          if (!date) return <span key={`pad-${index}`} aria-hidden />;

          const isFuture = dayNumber(date) > todayNumber;
          const isSelected = date === selected;
          const isToday = date === today;
          const hasNote = writtenDates.has(date);

          return (
            <button
              key={date}
              type="button"
              disabled={isFuture}
              aria-current={isToday ? "date" : undefined}
              aria-pressed={isSelected}
              onClick={() => onSelect(date)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "text-muted-foreground hover:bg-secondary hover:text-foreground",
                hasNote && "bg-primary/15 text-primary",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isToday && !isSelected && "ring-1 ring-foreground/30",
                isFuture && "pointer-events-none opacity-25",
              )}
            >
              {parseISODate(date).getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3 font-mono text-[10px] lowercase text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] bg-primary/15" />
          written
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] bg-primary" />
          showing
        </span>
      </div>
    </div>
  );
}
