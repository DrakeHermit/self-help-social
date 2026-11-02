"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { withRLS } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/user";
import { createJournalEntrySchema, parseInput } from "@/lib/validation";

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
