"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  FOLDER_ICON_KEYS,
  FOLDER_TINT_KEYS,
  type HabitFolder,
} from "./HabitFolderCard";

export type NewHabitFolderInput = Pick<
  HabitFolder,
  "name" | "icon" | "tint" | "cadence" | "target"
>;

export type NewHabitFolderProps = {
  onCreate: (input: NewHabitFolderInput) => void;
};

const TINT_DOTS: Record<string, string> = {
  terracotta: "bg-primary",
  sage: "bg-highlight",
  sand: "bg-[#c6b49e]",
  clay: "bg-[#a85c33]",
};

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function NewHabitFolder({ onCreate }: NewHabitFolderProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(FOLDER_ICON_KEYS[0]);
  const [tint, setTint] = useState(FOLDER_TINT_KEYS[0]);
  const [cadence, setCadence] = useState("daily");
  const [target, setTarget] = useState("");

  function reset() {
    setName("");
    setIcon(FOLDER_ICON_KEYS[0]);
    setTint(FOLDER_TINT_KEYS[0]);
    setCadence("daily");
    setTarget("");
  }

  function close() {
    reset();
    setOpen(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate({
      name: trimmed,
      icon,
      tint,
      cadence,
      target: target ? Number(target) : null,
    });
    close();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-full min-h-[10rem] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 p-5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Plus strokeWidth={2} aria-hidden />
        <span className="text-sm lowercase">add a habit</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="font-serif text-lg text-foreground">new habit</p>
        <button
          type="button"
          onClick={close}
          aria-label="cancel"
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="folder-name" className="lowercase text-foreground">
          name
        </Label>
        <Input
          id="folder-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. reading"
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="folder-cadence" className="lowercase text-foreground">
            cadence
          </Label>
          <select
            id="folder-cadence"
            value={cadence}
            onChange={(event) => setCadence(event.target.value)}
            className={selectClass}
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="folder-target" className="lowercase text-foreground">
            target
          </Label>
          <Input
            id="folder-target"
            type="number"
            min={1}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="optional"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="folder-icon" className="lowercase text-foreground">
          icon
        </Label>
        <select
          id="folder-icon"
          value={icon}
          onChange={(event) => setIcon(event.target.value)}
          className={selectClass}
        >
          {FOLDER_ICON_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <span className="text-sm font-medium lowercase text-foreground">
          tint
        </span>
        <div role="radiogroup" aria-label="tint" className="flex gap-2">
          {FOLDER_TINT_KEYS.map((key) => {
            const selected = tint === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={key}
                onClick={() => setTint(key)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "ring-2 ring-foreground/50",
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-full",
                    TINT_DOTS[key] ?? TINT_DOTS.terracotta,
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={close}
          className="flex-1 rounded-full lowercase"
        >
          cancel
        </Button>
        <Button type="submit" className="flex-1 rounded-full lowercase">
          plant it
        </Button>
      </div>
    </form>
  );
}
