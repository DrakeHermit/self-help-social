"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { deleteJournalEntry, updateJournalEntry } from "@/actions/journal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { RichTextView } from "@/components/ui/rich-text-view";
import { dayHeading, toISODate } from "@/lib/dates";
import { type JournalEntry } from "@/lib/journal";
import { JOURNAL_TITLE_MAX } from "@/lib/limits";

export type JournalEntryCardProps = {
  entry: JournalEntry;
  today: string;
};

// Treat anything within a few seconds of creation as "not edited".
const EDITED_THRESHOLD_MS = 5_000;

export function JournalEntryCard({ entry, today }: JournalEntryCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [html, setHtml] = useState(entry.content);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const changed = title.trim() !== entry.title || html !== entry.content;
  const edited =
    new Date(entry.updatedAt).getTime() - new Date(entry.createdAt).getTime() >
    EDITED_THRESHOLD_MS;

  function run(action: () => Promise<void>, fallback: string) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setEditing(false);
        setConfirmingDelete(false);
        router.refresh();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : fallback);
      }
    });
  }

  function save() {
    if (!changed || !title.trim() || !html) return;
    run(
      () => updateJournalEntry(entry.id, title, html),
      "That didn't save. Try again?",
    );
  }

  function cancel() {
    setTitle(entry.title);
    setHtml(entry.content);
    setError(null);
    setEditing(false);
  }

  return (
    <li className="rounded-2xl border border-border/70 bg-card/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {dayHeading(toISODate(new Date(entry.createdAt)), today)}
          {edited ? " · edited" : ""}
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
                  () => deleteJournalEntry(entry.id),
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
          onKeyDown={(event) => {
            if (event.key === "Escape") cancel();
          }}
        >
          <div className="mt-2 space-y-1.5">
            <Label
              htmlFor={`journal-title-${entry.id}`}
              className="lowercase text-foreground"
            >
              title
            </Label>
            <Input
              id={`journal-title-${entry.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isPending}
              maxLength={JOURNAL_TITLE_MAX}
              autoFocus
            />
          </div>
          <RichTextEditor
            value={html}
            onChange={setHtml}
            disabled={isPending}
            aria-label="Edit journal entry"
            className="mt-3"
            contentClassName="min-h-[10rem]"
          />
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !changed || !title.trim() || !html}
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
        <>
          <h3 className="mt-1 font-serif text-lg tracking-tight text-foreground">
            {entry.title}
          </h3>
          <RichTextView
            note={entry.content}
            format="html"
            className="mt-1.5"
          />
        </>
      )}

      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </li>
  );
}
