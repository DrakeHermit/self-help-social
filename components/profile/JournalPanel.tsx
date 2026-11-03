"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createJournalEntry } from "@/actions/journal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { JournalEntryCard } from "@/components/profile/JournalEntryCard";
import { dayHeading, todayISO } from "@/lib/dates";
import { type JournalEntry } from "@/lib/journal";
import { JOURNAL_TITLE_MAX } from "@/lib/limits";

const SAVE_DELAY_MS = 600;

export type JournalPanelProps = {
  userId?: string;
  entries: JournalEntry[];
};

type Draft = { title: string; html: string };
type Loaded = { draft: Draft; today: string };

const EMPTY_DRAFT: Draft = { title: "", html: "" };

function readDraft(storageKey: string): Draft {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      html: typeof parsed.html === "string" ? parsed.html : "",
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function JournalPanel({ userId, entries }: JournalPanelProps) {
  const router = useRouter();
  const storageKey = `journal:entry-draft:${userId ?? "guest"}`;
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const draft = readDraft(storageKey);
    setTitle(draft.title);
    setHtml(draft.html);
    setLoaded({ draft, today: todayISO() });
  }, [storageKey]);

  function persist(next: Draft) {
    try {
      if (next.title || next.html) {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        setSavedLabel("draft kept on this device");
      } else {
        window.localStorage.removeItem(storageKey);
        setSavedLabel(null);
      }
    } catch {
      setSavedLabel("couldn't keep the draft on this device");
    }
  }

  function scheduleDraftSave(next: Draft) {
    setSavedLabel(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(next), SAVE_DELAY_MS);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleDraftSave({ title: value, html });
  }

  function handleContentChange(value: string) {
    setHtml(value);
    scheduleDraftSave({ title, html: value });
  }

  function resetComposer() {
    if (timer.current) clearTimeout(timer.current);
    persist(EMPTY_DRAFT);
    setTitle("");
    setHtml("");
    setError(null);
    setLoaded((prev) => (prev ? { ...prev, draft: EMPTY_DRAFT } : prev));
    setEditorKey((key) => key + 1);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await createJournalEntry(title, html);
        resetComposer();
        router.refresh();
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "That didn't save. Try again?",
        );
      }
    });
  }

  if (!loaded) {
    return <div className="h-72 w-full animate-pulse rounded-2xl bg-muted" />;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 p-5 shadow-sm lg:p-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {dayHeading(loaded.today, loaded.today)}
          </p>
          <h2 className="mt-1.5 font-serif text-xl tracking-tight text-foreground">
            what&apos;s on your mind?
          </h2>

          <div className="mt-4 space-y-1.5">
            <Label
              htmlFor="journal-title"
              className="lowercase text-foreground"
            >
              title
            </Label>
            <Input
              id="journal-title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              disabled={isPending}
              maxLength={JOURNAL_TITLE_MAX}
              placeholder="a few words for today"
            />
          </div>

          <RichTextEditor
            key={editorKey}
            value={loaded.draft.html}
            onChange={handleContentChange}
            disabled={isPending}
            placeholder="write as much or as little as you like."
            aria-label="Journal entry"
            className="mt-4"
            contentClassName="min-h-[16rem]"
          />

          {error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !html}
              className="rounded-full lowercase"
            >
              {isPending ? "saving…" : "save entry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending || (!title && !html)}
              onClick={resetComposer}
              className="rounded-full lowercase"
            >
              clear draft
            </Button>
            <span
              role="status"
              className="ml-auto font-mono text-[10px] lowercase text-muted-foreground"
            >
              {savedLabel}
            </span>
          </div>
        </form>
      </Card>

      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          earlier
        </h2>
        {entries.length === 0 ? (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            nothing written here yet. your first entry will show up here.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {entries.map((entry) => (
              <JournalEntryCard
                key={`${entry.id}:${entry.updatedAt}`}
                entry={entry}
                today={loaded.today}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
