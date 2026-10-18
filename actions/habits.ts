"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { withRLS, type RLSTransaction } from "@/lib/db";
import { habitEntries, habits } from "@/lib/db/schema";
import { dayNumber, isValidISODate, todayISO } from "@/lib/dates";
import { getCurrentUser } from "@/lib/user";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");
  return user;
}

// RLS already scopes these queries to the signed-in user; the explicit
// ownership checks give a clear "not found" error instead of a silent no-op.
async function requireOwnedHabit(
  tx: RLSTransaction,
  userId: string,
  habitId: string,
): Promise<string> {
  const [habit] = await tx
    .select({ id: habits.id })
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .limit(1);

  if (!habit) throw new Error("Habit not found.");
  return habit.id;
}

export async function createHabit(
  name: string,
  description?: string | null,
): Promise<string> {
  const user = await requireUser();

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Give the habit a name.");

  const [habit] = await withRLS({ sub: user.id }, (tx) =>
    tx
      .insert(habits)
      .values({
        id: randomUUID(),
        userId: user.id,
        name: trimmed,
        description: description?.trim() || null,
      })
      .returning({ id: habits.id }),
  );

  revalidatePath("/profile");
  return habit.id;
}

async function requireOwnedEntry(
  tx: RLSTransaction,
  userId: string,
  entryId: string,
): Promise<string> {
  const [entry] = await tx
    .select({ habitId: habitEntries.habitId })
    .from(habitEntries)
    .innerJoin(habits, eq(habitEntries.habitId, habits.id))
    .where(and(eq(habitEntries.id, entryId), eq(habits.userId, userId)))
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
  const user = await requireUser();

  if (!isValidISODate(date)) throw new Error("That isn't a real date.");
  if (dayNumber(date) > dayNumber(todayISO())) {
    throw new Error("You can't write ahead of today.");
  }

  const trimmed = note.trim();
  if (!trimmed) throw new Error("Write something first.");

  await withRLS({ sub: user.id }, async (tx) => {
    await requireOwnedHabit(tx, user.id, habitId);
    await tx.insert(habitEntries).values({
      id: randomUUID(),
      habitId,
      date,
      note: trimmed,
      completed: true,
    });
  });

  revalidateHabit(habitId);
}

export async function updateHabitNote(
  entryId: string,
  note: string,
): Promise<void> {
  const user = await requireUser();

  const trimmed = note.trim();
  if (!trimmed) throw new Error("An entry can't be empty. Delete it instead?");

  const habitId = await withRLS({ sub: user.id }, async (tx) => {
    const habitId = await requireOwnedEntry(tx, user.id, entryId);
    await tx
      .update(habitEntries)
      .set({ note: trimmed, updatedAt: new Date() })
      .where(eq(habitEntries.id, entryId));
    return habitId;
  });

  revalidateHabit(habitId);
}

export async function deleteHabitNote(entryId: string): Promise<void> {
  const user = await requireUser();

  const habitId = await withRLS({ sub: user.id }, async (tx) => {
    const habitId = await requireOwnedEntry(tx, user.id, entryId);
    await tx.delete(habitEntries).where(eq(habitEntries.id, entryId));
    return habitId;
  });

  revalidateHabit(habitId);
}
