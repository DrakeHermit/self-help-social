"use client";

import { useState } from "react";

import { HabitFolderCard, type HabitFolder } from "./HabitFolderCard";
import { NewHabitFolder, type NewHabitFolderInput } from "./NewHabitFolder";

export type HabitFolderGridProps = {
  initialFolders: HabitFolder[];
};

export function HabitFolderGrid({ initialFolders }: HabitFolderGridProps) {
  const [folders, setFolders] = useState<HabitFolder[]>(initialFolders);

  function handleCreate(input: NewHabitFolderInput) {
    const folder: HabitFolder = {
      id: crypto.randomUUID(),
      entryCount: 0,
      lastEntryLabel: null,
      ...input,
    };
    setFolders((prev) => [folder, ...prev]);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <NewHabitFolder onCreate={handleCreate} />
      </div>
    </div>
  );
}
