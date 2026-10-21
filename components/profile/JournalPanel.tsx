"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { dayHeading, todayISO } from "@/lib/dates";

const SAVE_DELAY_MS = 600;

export type JournalPanelProps = {
  userId?: string;
};

type Loaded = { draft: string; today: string };

export function JournalPanel({ userId }: JournalPanelProps) {
  const storageKey = `journal:draft:${userId ?? "guest"}`;
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [html, setHtml] = useState("");
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let draft = "";
    try {
      draft = window.localStorage.getItem(storageKey) ?? "";
    } catch {}
    setHtml(draft);
    setLoaded({ draft, today: todayISO() });
  }, [storageKey]);

  function persist(value: string) {
    try {
      if (value) window.localStorage.setItem(storageKey, value);
      else window.localStorage.removeItem(storageKey);
      setSavedLabel(value ? "draft saved on this device" : null);
    } catch {
      setSavedLabel("couldn't keep the draft on this device");
    }
  }

  function handleChange(value: string) {
    setHtml(value);
    setSavedLabel(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(value), SAVE_DELAY_MS);
  }

  function clearDraft() {
    if (timer.current) clearTimeout(timer.current);
    persist("");
    setHtml("");
    setLoaded((prev) => (prev ? { ...prev, draft: "" } : prev));
    setEditorKey((key) => key + 1);
  }

  if (!loaded) {
    return <div className="h-72 w-full animate-pulse rounded-2xl bg-muted" />;
  }

  return (
    <Card className="rounded-2xl border-border/70 p-5 shadow-sm lg:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {dayHeading(loaded.today, loaded.today)}
      </p>
      <h2 className="mt-1.5 font-serif text-xl tracking-tight text-foreground">
        what&apos;s on your mind?
      </h2>

      <RichTextEditor
        key={editorKey}
        value={loaded.draft}
        onChange={handleChange}
        placeholder="write as much or as little as you like."
        aria-label="Journal entry"
        className="mt-4"
        contentClassName="min-h-[16rem]"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!html}
          onClick={clearDraft}
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
    </Card>
  );
}
