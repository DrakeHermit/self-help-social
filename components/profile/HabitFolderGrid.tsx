"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createHabit } from "@/actions/habits";
import { cn } from "@/lib/utils";
import { HabitFolderCard, type HabitFolder } from "./HabitFolderCard";
import { NewHabitFolder, type NewHabitFolderInput } from "./NewHabitFolder";

export type HabitFolderGridProps = {
  folders: HabitFolder[];
};

export function HabitFolderGrid({ folders }: HabitFolderGridProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [composing, setComposing] = useState(false);

  function handleCreate(input: NewHabitFolderInput) {
    startTransition(async () => {
      await createHabit(input.name);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 lg:grid-cols-3",
        composing && "items-start",
        isPending && "opacity-70",
      )}
    >
      {folders.map((folder, index) => (
        <div
          key={folder.id}
          className="animate-rise-in"
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          <HabitFolderCard folder={folder} />
        </div>
      ))}
      <div
        className="animate-rise-in"
        style={{ animationDelay: `${Math.min(folders.length, 8) * 40}ms` }}
      >
        <NewHabitFolder
          onCreate={handleCreate}
          open={composing}
          onOpenChange={setComposing}
        />
      </div>
    </div>
  );
}
