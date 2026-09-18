"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveHabitNote } from "@/actions/habits";
import { HabitCalendar } from "@/components/profile/HabitCalendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { dayHeading } from "@/lib/dates";
import { type HabitNote } from "@/lib/habits";
import { cn } from "@/lib/utils";

export type HabitJournalProps = {
  habitId: string;
  notes: HabitNote[];
  today: string;
};

export function HabitJournal({ habitId, notes, today }: HabitJournalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(today);

  const notesByDate = useMemo(
    () => new Map(notes.map((entry) => [entry.date, entry.note])),
    [notes],
  );
  const saved = notesByDate.get(selected) ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="space-y-6">
        <DayComposer
          // Remount on a date change or a save so the box always opens with
          // whatever that day currently holds.
          key={`${selected}:${saved}`}
          habitId={habitId}
          date={selected}
          today={today}
          saved={saved}
          onSaved={() => router.refresh()}
        />

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            earlier
          </h2>
          {notes.length === 0 ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              nothing written here yet. whatever you put down today starts the
              record.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {notes.map((entry) => (
                <li key={entry.date}>
                  <button
                    type="button"
                    onClick={() => setSelected(entry.date)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      entry.date === selected
                        ? "border-primary/40 bg-card"
                        : "border-border/70 bg-card/40 hover:border-primary/30",
                    )}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                      {dayHeading(entry.date, today)}
                    </span>
                    <span className="mt-1.5 block whitespace-pre-line text-sm leading-relaxed text-foreground">
                      {entry.note}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Card className="h-fit rounded-2xl border-border/70 p-4 shadow-sm lg:sticky lg:top-6">
        <HabitCalendar
          writtenDates={new Set(notesByDate.keys())}
          selected={selected}
          today={today}
          onSelect={setSelected}
        />
      </Card>
    </div>
  );
}

type DayComposerProps = {
  habitId: string;
  date: string;
  today: string;
  saved: string;
  onSaved: () => void;
};

function DayComposer({
  habitId,
  date,
  today,
  saved,
  onSaved,
}: DayComposerProps) {
  const [text, setText] = useState(saved);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const heading = dayHeading(date, today);
  const isToday = date === today;
  const changed = text.trim() !== saved.trim();

  function save(value: string) {
    setError(null);
    startTransition(async () => {
      try {
        await saveHabitNote(habitId, date, value);
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

        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={isPending}
          rows={6}
          autoFocus={isToday && !saved}
          placeholder="a sentence is plenty."
          className="mt-4 resize-y leading-relaxed"
        />

        {error ? (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={isPending || !changed || !text.trim()}
            className="rounded-full lowercase"
          >
            {isPending ? "saving…" : saved ? "save" : "plant it"}
          </Button>
          {saved ? (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => save("")}
              className="rounded-full lowercase"
            >
              remove
            </Button>
          ) : null}
          <span className="ml-auto font-mono text-[10px] lowercase text-muted-foreground">
            {saved ? "counts towards your year" : "saving marks the day"}
          </span>
        </div>
      </form>
    </Card>
  );
}
