import { cache } from "react";
import { and, asc, eq, gte, lte, sql } from "drizzle-orm";

import {
  FOLDER_TINT_KEYS,
  type HabitFolder,
} from "@/components/profile/HabitFolderCard";
import { type ProfileStatsProps } from "@/components/profile/ProfileStats";
import { db } from "@/lib/db";
import { habitEntries, habits } from "@/lib/db/schema";

const DAY_MS = 86_400_000;

const ICON_KEYWORDS: [RegExp, string][] = [
  [/read|book|page/, "book"],
  [/water|drink|hydrat/, "water"],
  [/walk|run|step|move|gym/, "walk"],
  [/sleep|bed|lights|rest/, "sleep"],
  [/journal|write|note/, "write"],
  [/meditat|breath|calm|gratitude/, "heart"],
];

function iconForName(name: string): string {
  const lower = name.toLowerCase();
  for (const [pattern, icon] of ICON_KEYWORDS) {
    if (pattern.test(lower)) return icon;
  }
  return "grow";
}

function tintForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return FOLDER_TINT_KEYS[hash % FOLDER_TINT_KEYS.length];
}

function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function dayNumber(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

function daysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

function relativeDayLabel(iso: string | null, today: string): string | null {
  if (!iso) return null;
  const diff = dayNumber(today) - dayNumber(iso);
  if (diff <= 0) return "today";
  if (diff === 1) return "yesterday";
  return `${diff} days ago`;
}

export const getHabitFolders = cache(
  async (userId: string): Promise<HabitFolder[]> => {
    const rows = await db
      .select({
        id: habits.id,
        name: habits.name,
        entryCount: sql<number>`count(${habitEntries.id})`.mapWith(Number),
        lastEntryDate: sql<string | null>`max(${habitEntries.date})`,
      })
      .from(habits)
      .leftJoin(
        habitEntries,
        and(
          eq(habitEntries.habitId, habits.id),
          eq(habitEntries.completed, true),
        ),
      )
      .where(eq(habits.userId, userId))
      .groupBy(habits.id, habits.name, habits.createdAt)
      .orderBy(asc(habits.createdAt));

    const today = toISODate(new Date());

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      icon: iconForName(row.name),
      tint: tintForId(row.id),
      cadence: null,
      target: null,
      entryCount: row.entryCount,
      lastEntryLabel: relativeDayLabel(row.lastEntryDate, today),
    }));
  },
);

export const getDailyEntryCounts = cache(
  async (userId: string, year: number): Promise<Map<string, number>> => {
    const rows = await db
      .select({
        date: habitEntries.date,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(habitEntries)
      .innerJoin(habits, eq(habitEntries.habitId, habits.id))
      .where(
        and(
          eq(habits.userId, userId),
          eq(habitEntries.completed, true),
          gte(habitEntries.date, `${year}-01-01`),
          lte(habitEntries.date, `${year}-12-31`),
        ),
      )
      .groupBy(habitEntries.date);

    return new Map(rows.map((row) => [row.date, row.count]));
  },
);

export type HabitDay = {
  date: string;
  completed: boolean;
};

export type HabitDetail = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  tint: string;
  days: HabitDay[];
  completedCount: number;
  currentStreak: number;
  longestStreak: number;
};

export const getHabitDetail = cache(
  async (
    userId: string,
    habitId: string,
    windowDays = 28,
  ): Promise<HabitDetail | null> => {
    const [habit] = await db
      .select({
        id: habits.id,
        name: habits.name,
        description: habits.description,
      })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
      .limit(1);

    if (!habit) return null;

    const entries = await db
      .select({ date: habitEntries.date, completed: habitEntries.completed })
      .from(habitEntries)
      .where(eq(habitEntries.habitId, habit.id));

    const byDate = new Map(entries.map((entry) => [entry.date, entry.completed]));
    const completedDates = entries
      .filter((entry) => entry.completed)
      .map((entry) => entry.date);
    const { current, longest } = streaks(completedDates);

    const today = new Date();
    const days: HabitDay[] = Array.from({ length: windowDays }, (_, offset) => {
      const day = new Date(today);
      day.setDate(day.getDate() - offset);
      const date = toISODate(day);
      return { date, completed: byDate.get(date) ?? false };
    });

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      icon: iconForName(habit.name),
      tint: tintForId(habit.id),
      days,
      completedCount: completedDates.length,
      currentStreak: current,
      longestStreak: longest,
    };
  },
);

function streaks(activeDays: string[]): {
  current: number;
  longest: number;
} {
  const days = activeDays.map(dayNumber).sort((a, b) => a - b);
  if (days.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] - days[i - 1] === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const today = dayNumber(toISODate(new Date()));
  const last = days[days.length - 1];
  const current = today - last <= 1 ? run : 0;

  return { current, longest };
}

export const getHabitStats = cache(
  async (userId: string, year: number): Promise<ProfileStatsProps> => {
    const counts = await getDailyEntryCounts(userId, year);
    const active = [...counts.keys()];
    const { current, longest } = streaks(active);

    const now = new Date();
    const elapsed =
      now.getFullYear() === year
        ? dayNumber(toISODate(now)) - dayNumber(`${year}-01-01`) + 1
        : daysInYear(year);

    return {
      currentStreak: current,
      longestStreak: longest,
      activeDays: active.length,
      totalDays: elapsed,
      heldBy: 0,
    };
  },
);
