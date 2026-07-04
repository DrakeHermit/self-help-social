"use client";

import { Plus, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SideBarProps = {
  name?: string;
  handle?: string;
  initials?: string;
};

export const SideBar = ({ name, handle, initials }: SideBarProps) => {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-white/5 bg-[#2a221b] text-[#f1e7d9] md:flex">
      <div className="p-4">
        <Button className="w-full rounded-full lowercase">
          <Plus strokeWidth={2.5} aria-hidden="true" />
          quick check-in
        </Button>
      </div>

      <div className="flex-1" />

      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 px-1 py-1">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              {initials ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-[#f5ece0]">
              {name ?? "You"}
            </span>
            <span className="truncate text-xs text-[#8a7b69]">
              @{handle ?? "you"}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Settings"
                className="size-8 rounded-full text-[#8a7b69] hover:bg-white/5 hover:text-[#f5ece0]"
              >
                <Settings strokeWidth={1.75} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-44">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User aria-hidden="true" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings aria-hidden="true" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};
