"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { withRLS } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/user";
import {
  createJournalEntrySchema,
  deleteJournalEntrySchema,
  parseInput,
  updateJournalEntrySchema,
} from "@/lib/validation";

export async function createJournalEntry(
  title: string,
  content: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");

  const input = parseInput(createJournalEntrySchema, { title, content });

  await withRLS({ sub: user.id }, (tx) =>
    tx.insert(journalEntries).values({
      id: randomUUID(),
      userId: user.id,
      title: input.title,
      content: input.content,
    }),
  );

  revalidatePath("/profile");
}

// RLS already limits these statements to the signed-in user's rows; an empty
// result means the entry doesn't exist or isn't theirs.
export async function updateJournalEntry(
  entryId: string,
  title: string,
  content: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");

  const input = parseInput(updateJournalEntrySchema, {
    entryId,
    title,
    content,
  });

  const updated = await withRLS({ sub: user.id }, (tx) =>
    tx
      .update(journalEntries)
      .set({
        title: input.title,
        content: input.content,
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, input.entryId))
      .returning({ id: journalEntries.id }),
  );
  if (updated.length === 0) throw new Error("Entry not found.");

  revalidatePath("/profile");
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You need to be signed in.");

  const input = parseInput(deleteJournalEntrySchema, { entryId });

  const deleted = await withRLS({ sub: user.id }, (tx) =>
    tx
      .delete(journalEntries)
      .where(eq(journalEntries.id, input.entryId))
      .returning({ id: journalEntries.id }),
  );
  if (deleted.length === 0) throw new Error("Entry not found.");

  revalidatePath("/profile");
}
