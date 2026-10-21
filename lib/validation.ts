import { z } from "zod";

import { isValidISODate } from "@/lib/dates";

export const NAME_MAX = 80;
export const DESCRIPTION_MAX = 280;
export const NOTE_MAX = 5000;
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 72;

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

const noteText = (emptyMessage: string) =>
  z
    .string()
    .trim()
    .min(1, emptyMessage)
    .max(NOTE_MAX, `Keep entries under ${NOTE_MAX} characters.`);

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
