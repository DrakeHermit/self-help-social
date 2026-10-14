"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { habitEntries, habits } from "@/lib/db/schema";
import { dayNumber, isValidISODate, todayISO } from "@/lib/dates";
import { getCurrentUser } from "@/lib/user";

async function requireOwnedHabit(habitId: string): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");

  const [habit] = await db
    .select({ id: habits.id })
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, user.id)))
    .limit(1);

  if (!habit) throw new Error("Habit not found.");
  return habit.id;
}

export async function createHabit(
  name: string,
  description?: string | null,
): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Give the habit a name.");

  const [habit] = await db
    .insert(habits)
    .values({
      id: randomUUID(),
      userId: user.id,
      name: trimmed,
      description: description?.trim() || null,
    })
    .returning({ id: habits.id });

  revalidatePath("/profile");
  return habit.id;
}

async function requireOwnedEntry(entryId: string): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");

  const [entry] = await db
    .select({ habitId: habitEntries.habitId })
    .from(habitEntries)
    .innerJoin(habits, eq(habitEntries.habitId, habits.id))
    .where(and(eq(habitEntries.id, entryId), eq(habits.userId, user.id)))
    .limit(1);

  if (!entry?.habitId) throw new Error("Entry not found.");
  return entry.habitId;
}

function revalidateHabit(habitId: string) {
  revalidatePath(`/profile/${habitId}`);
  revalidatePath("/profile");
}

export async function addHabitNote(
  habitId: string,
  date: string,
  note: string,
): Promise<void> {
  await requireOwnedHabit(habitId);

  if (!isValidISODate(date)) throw new Error("That isn't a real date.");
  if (dayNumber(date) > dayNumber(todayISO())) {
    throw new Error("You can't write ahead of today.");
  }

  const trimmed = note.trim();
  if (!trimmed) throw new Error("Write something first.");

  await db.insert(habitEntries).values({
    id: randomUUID(),
    habitId,
    date,
    note: trimmed,
    completed: true,
  });

  revalidateHabit(habitId);
}

export async function updateHabitNote(
  entryId: string,
  note: string,
): Promise<void> {
  const habitId = await requireOwnedEntry(entryId);

  const trimmed = note.trim();
  if (!trimmed) throw new Error("An entry can't be empty. Delete it instead?");

  await db
    .update(habitEntries)
    .set({ note: trimmed, updatedAt: new Date() })
    .where(eq(habitEntries.id, entryId));

  revalidateHabit(habitId);
}

export async function deleteHabitNote(entryId: string): Promise<void> {
  const habitId = await requireOwnedEntry(entryId);

  await db.delete(habitEntries).where(eq(habitEntries.id, entryId));

  revalidateHabit(habitId);
}
