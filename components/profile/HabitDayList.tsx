"use client";

import { useOptimistic, useTransition } from "react";

import { setHabitEntry } from "@/actions/habits";
import { Checkbox } from "@/components/ui/checkbox";
import { type HabitDay } from "@/lib/habits";
import { cn } from "@/lib/utils";

export type HabitDayListProps = {
  habitId: string;
  days: HabitDay[];
};

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function labelFor(date: string, index: number): string {
  if (index === 0) return "today";
  if (index === 1) return "yesterday";

  const [year, month, day] = date.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${weekday} · ${MONTHS[month - 1]} ${day}`;
}

export function HabitDayList({ habitId, days }: HabitDayListProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDays, toggleDay] = useOptimistic(
    days,
    (state: HabitDay[], toggled: HabitDay) =>
      state.map((day) =>
        day.date === toggled.date
          ? { ...day, completed: toggled.completed }
          : day,
      ),
  );

  function handleToggle(day: HabitDay, completed: boolean) {
    startTransition(async () => {
      toggleDay({ ...day, completed });
      await setHabitEntry(habitId, day.date, completed);
    });
  }

  return (
    <ul
      className={cn(
        "divide-y divide-border/70 transition-opacity",
        isPending && "opacity-70",
      )}
    >
      {optimisticDays.map((day, index) => (
        <li key={day.date} className="flex items-center gap-3 py-2.5">
          <Checkbox
            id={`day-${day.date}`}
            checked={day.completed}
            onCheckedChange={(checked) => handleToggle(day, checked === true)}
          />
          <label
            htmlFor={`day-${day.date}`}
            className={cn(
              "flex-1 cursor-pointer text-sm lowercase",
              day.completed ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {labelFor(day.date, index)}
          </label>
          {day.completed ? (
            <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              done
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
