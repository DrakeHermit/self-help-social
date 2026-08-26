import Link from "next/link";
import {
  BookOpen,
  Droplet,
  Footprints,
  Heart,
  Moon,
  PenLine,
  Sprout,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type HabitFolder = {
  id: string;
  name: string;
  icon: string;
  tint: string;
  cadence: string | null;
  target: number | null;
  entryCount: number;
  lastEntryLabel: string | null;
};

const ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  water: Droplet,
  walk: Footprints,
  heart: Heart,
  sleep: Moon,
  write: PenLine,
  grow: Sprout,
};

const TINTS: Record<string, string> = {
  terracotta: "bg-primary/15 text-primary",
  sage: "bg-highlight/15 text-highlight",
  sand: "bg-secondary text-foreground",
  clay: "bg-[#e3b48d]/40 text-[#8a4424]",
};

export const FOLDER_ICON_KEYS = Object.keys(ICONS);
export const FOLDER_TINT_KEYS = Object.keys(TINTS);

function iconFor(key: string): LucideIcon {
  return ICONS[key] ?? BookOpen;
}

function tintFor(key: string): string {
  return TINTS[key] ?? TINTS.terracotta;
}

export type HabitFolderCardProps = {
  folder: HabitFolder;
};

export function HabitFolderCard({ folder }: HabitFolderCardProps) {
  const Icon = iconFor(folder.icon);
  const meta = [folder.cadence, folder.target ? `${folder.target}/day` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/profile/${folder.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full rounded-2xl border-border/70 p-5 shadow-sm transition-colors group-hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              tintFor(folder.tint),
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {folder.entryCount} {folder.entryCount === 1 ? "entry" : "entries"}
          </span>
        </div>

        <h3 className="mt-4 font-serif text-lg leading-tight text-foreground">
          {folder.name}
        </h3>
        {meta ? (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {meta}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-muted-foreground">
          {folder.lastEntryLabel ?? "nothing planted yet"}
        </p>
      </Card>
    </Link>
  );
}
