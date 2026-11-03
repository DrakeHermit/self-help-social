import { z } from "zod";

import { isValidISODate } from "@/lib/dates";
import {
  DESCRIPTION_MAX,
  JOURNAL_MAX,
  JOURNAL_TITLE_MAX,
  NAME_MAX,
  NOTE_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
} from "@/lib/limits";
import { htmlToText, sanitizeNoteHtml } from "@/lib/sanitize";

export function parseInput<T extends z.ZodType>(
  schema: T,
  input: unknown,
): z.output<T> {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0].message);
  return result.data;
}

const id = z.uuid("That doesn't look right.");

const habitName = z
  .string()
  .trim()
  .min(1, "Give the habit a name.")
  .max(NAME_MAX, `Keep the name under ${NAME_MAX} characters.`);

const habitDescription = z
  .string()
  .trim()
  .max(DESCRIPTION_MAX, `Keep the description under ${DESCRIPTION_MAX} characters.`)
  .nullish()
  .transform((value) => value || null);

// Notes are rich text (HTML). The length limit applies to the visible text,
// with a looser cap on the raw markup so it can't be abused.
const noteText = (emptyMessage: string, max = NOTE_MAX) =>
  z
    .string()
    .max(max * 4, `Keep entries under ${max} characters.`)
    .transform((html) => sanitizeNoteHtml(html))
    .refine((html) => htmlToText(html).length > 0, emptyMessage)
    .refine(
      (html) => htmlToText(html).length <= max,
      `Keep entries under ${max} characters.`,
    );

export const createHabitSchema = z.object({
  name: habitName,
  description: habitDescription,
});

export const addHabitNoteSchema = z.object({
  habitId: id,
  date: z
    .string()
    .refine(isValidISODate, "That isn't a real date."),
  note: noteText("Write something first."),
});

export const updateHabitNoteSchema = z.object({
  entryId: id,
  note: noteText("An entry can't be empty. Delete it instead?"),
});

const journalTitle = z
  .string()
  .trim()
  .min(1, "Give the entry a title.")
  .max(
    JOURNAL_TITLE_MAX,
    `Keep the title under ${JOURNAL_TITLE_MAX} characters.`,
  );

const journalContent = noteText("Write something first.", JOURNAL_MAX);

export const createJournalEntrySchema = z.object({
  title: journalTitle,
  content: journalContent,
});

export const updateJournalEntrySchema = z.object({
  entryId: id,
  title: journalTitle,
  content: journalContent,
});

export const deleteJournalEntrySchema = z.object({ entryId: id });

export const deleteHabitNoteSchema = z.object({ entryId: id });

const email = z.email("Enter a valid email address.").max(254);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(PASSWORD_MAX),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tell us your name.")
    .max(NAME_MAX, `Keep your name under ${NAME_MAX} characters.`),
  email,
  password: z
    .string()
    .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`)
    .max(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters.`),
});
