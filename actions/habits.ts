"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { habitEntries, habits } from "@/lib/db/schema";
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

export async function setHabitEntry(
  habitId: string,
  date: string,
  completed: boolean,
): Promise<void> {
  await requireOwnedHabit(habitId);

  const [existing] = await db
    .select({ id: habitEntries.id })
    .from(habitEntries)
    .where(and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, date)))
    .limit(1);

  if (existing) {
    await db
      .update(habitEntries)
      .set({ completed, updatedAt: new Date() })
      .where(eq(habitEntries.id, existing.id));
  } else {
    await db.insert(habitEntries).values({
      id: randomUUID(),
      habitId,
      date,
      completed,
    });
  }

  revalidatePath(`/profile/${habitId}`);
  revalidatePath("/profile");
}
