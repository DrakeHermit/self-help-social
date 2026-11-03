import { cache } from "react";
import { desc } from "drizzle-orm";

import { withRLS } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { sanitizeNoteHtml } from "@/lib/sanitize";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const ENTRY_LIMIT = 100;

export const getJournalEntries = cache(
  async (userId: string): Promise<JournalEntry[]> => {
    const rows = await withRLS({ sub: userId }, (tx) =>
      tx
        .select({
          id: journalEntries.id,
          title: journalEntries.title,
          content: journalEntries.content,
          createdAt: journalEntries.createdAt,
          updatedAt: journalEntries.updatedAt,
        })
        .from(journalEntries)
        .orderBy(desc(journalEntries.createdAt))
        .limit(ENTRY_LIMIT),
    );

    // Sanitize again on read: rows can also be written straight through the
    // Supabase API, which skips the server action.
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: sanitizeNoteHtml(row.content),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  },
);
