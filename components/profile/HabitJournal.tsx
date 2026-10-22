"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";

import { addHabitNote, deleteHabitNote, updateHabitNote } from "@/actions/habits";
import { HabitCalendar } from "@/components/profile/HabitCalendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { RichTextView } from "@/components/ui/rich-text-view";
import { dayHeading } from "@/lib/dates";
import { type HabitNote } from "@/lib/habits";
import { noteToEditorHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

export type HabitJournalProps = {
  habitId: string;
  notes: HabitNote[];
  today: string;
};

export function HabitJournal({ habitId, notes, today }: HabitJournalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(today);
  const [filtered, setFiltered] = useState(false);

  const writtenDates = useMemo(
    () => new Set(notes.map((entry) => entry.date)),
    [notes],
  );
  const visibleNotes = filtered
    ? notes.filter((entry) => entry.date === selected)
    : notes;

  function selectDay(date: string) {
    setSelected(date);
    setFiltered(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="space-y-6">
        <DayComposer
          key={selected}
          habitId={habitId}
          date={selected}
          today={today}
          hasEntries={writtenDates.has(selected)}
          onSaved={() => router.refresh()}
        />

        <section>
          <div className="flex min-h-7 items-center gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {filtered ? dayHeading(selected, today) : "earlier"}
            </h2>
            {filtered ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setFiltered(false)}
                className="h-7 gap-1.5 rounded-full border-primary/40 bg-primary/10 px-3 lowercase text-foreground hover:bg-primary/20"
              >
                <X className="size-3.5" aria-hidden />
                show all
              </Button>
            ) : null}
          </div>
          {visibleNotes.length === 0 ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {filtered
                ? "nothing written on this day yet."
                : "nothing written here yet. whatever you put down today starts the record."}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {visibleNotes.map((entry) => (
                <EntryCard
                  key={`${entry.id}:${entry.note}`}
                  entry={entry}
                  today={today}
                  highlighted={!filtered && entry.date === selected}
                  onChanged={() => router.refresh()}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <Card className="h-fit rounded-2xl border-border/70 p-4 shadow-sm lg:sticky lg:top-6">
        <HabitCalendar
          writtenDates={writtenDates}
          selected={selected}
          today={today}
          onSelect={selectDay}
        />
      </Card>
    </div>
  );
}

type DayComposerProps = {
  habitId: string;
  date: string;
  today: string;
  hasEntries: boolean;
  onSaved: () => void;
};

function DayComposer({
  habitId,
  date,
  today,
  hasEntries,
  onSaved,
}: DayComposerProps) {
  const [text, setText] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const heading = dayHeading(date, today);
  const isToday = date === today;

  function save(value: string) {
    setError(null);
    startTransition(async () => {
      try {
        await addHabitNote(habitId, date, value);
        setText("");
        setEditorKey((key) => key + 1);
        onSaved();
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "That didn't save. Try again?",
        );
      }
    });
  }

  return (
    <Card className="rounded-2xl border-border/70 p-5 shadow-sm lg:p-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          save(text);
        }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {heading}
        </p>
        <h2 className="mt-1.5 font-serif text-xl tracking-tight text-foreground">
          {isToday ? "what grew today?" : "what happened that day?"}
        </h2>

        <RichTextEditor
          key={editorKey}
          value={text}
          onChange={setText}
          disabled={isPending}
          autoFocus={isToday && !hasEntries}
          placeholder="a sentence is plenty."
          aria-label="Write an entry"
          className="mt-4"
          contentClassName="min-h-[9rem]"
        />

        {error ? (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={isPending || !text}
            className="rounded-full lowercase"
          >
            {isPending ? "saving…" : hasEntries ? "add another" : "plant it"}
          </Button>
          <span className="ml-auto font-mono text-[10px] lowercase text-muted-foreground">
            {hasEntries ? "adds to this day" : "saving marks the day"}
          </span>
        </div>
      </form>
    </Card>
  );
}

type EntryCardProps = {
  entry: HabitNote;
  today: string;
  highlighted: boolean;
  onChanged: () => void;
};

function EntryCard({ entry, today, highlighted, onChanged }: EntryCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const initialHtml = noteToEditorHtml(entry.note, entry.format);
  const [text, setText] = useState(initialHtml);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const changed = text !== initialHtml;

  function run(action: () => Promise<void>, fallback: string) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        onChanged();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : fallback);
      }
    });
  }

  function save() {
    if (!changed || !text) return;
    run(
      () => updateHabitNote(entry.id, text),
      "That didn't save. Try again?",
    );
  }

  function cancel() {
    setText(initialHtml);
    setError(null);
    setEditing(false);
  }

  return (
    <li
      className={cn(
        "rounded-2xl border px-4 py-3 transition-colors",
        highlighted ? "border-primary/40 bg-card" : "border-border/70 bg-card/40",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {dayHeading(entry.date, today)}
        </span>
        {editing ? null : confirmingDelete ? (
          <div className="-my-1.5 ml-auto flex items-center gap-1">
            <span className="mr-1 font-mono text-[10px] lowercase text-muted-foreground">
              delete?
            </span>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isPending}
              autoFocus
              onClick={() =>
                run(
                  () => deleteHabitNote(entry.id),
                  "That didn't delete. Try again?",
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") setConfirmingDelete(false);
              }}
              className="h-7 rounded-full px-3 lowercase"
            >
              {isPending ? "deleting…" : "yes"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => setConfirmingDelete(false)}
              className="h-7 rounded-full px-3 lowercase"
            >
              no
            </Button>
          </div>
        ) : (
          <div className="-my-1.5 -mr-2 ml-auto flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => setEditing(true)}
              aria-label="Edit entry"
              className="size-8 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3.5" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => {
                setError(null);
                setConfirmingDelete(true);
              }}
              aria-label="Delete entry"
              className="size-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <div
            onKeyDown={(event) => {
              if (event.key === "Escape") cancel();
            }}
          >
            <RichTextEditor
              value={text}
              onChange={setText}
              disabled={isPending}
              autoFocus
              aria-label="Edit entry"
              className="mt-2"
              contentClassName="min-h-[6rem]"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !changed || !text}
              className="rounded-full lowercase"
            >
              {isPending ? "saving…" : "save"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={cancel}
              className="rounded-full lowercase"
            >
              cancel
            </Button>
          </div>
        </form>
      ) : (
        <RichTextView
          note={entry.note}
          format={entry.format}
          className="mt-1.5"
        />
      )}

      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </li>
  );
}
