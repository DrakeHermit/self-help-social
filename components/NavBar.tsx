"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Home, Search, Sprout, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FEATURES } from "@/lib/flags";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Partners", href: "/partners", icon: Users },
  { label: "Habits", href: "/habits", icon: Target },
  ...(FEATURES.garden
    ? [{ label: "Garden", href: "/garden", icon: Sprout }]
    : []),
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const NavBar = () => {
  const pathname = usePathname() ?? "/";
  const youActive = isActivePath(pathname, "/profile");

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#2a221b] text-[#f1e7d9] shadow-sm">
      <div className="relative flex h-16 w-full">
        <Link
          href="/"
          aria-label="hearth home"
          className="flex items-center gap-3 px-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70 sm:px-6 md:w-60 md:shrink-0 md:border-r md:border-white/5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3a2e25] text-lg font-semibold lowercase text-primary ring-1 ring-white/5">
            h
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-semibold lowercase tracking-tight text-[#f5ece0]">
              hearth
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#9a8a78] sm:inline">
              Self help, together
            </span>
          </span>
        </Link>

        <div className="flex flex-1 items-center lg:relative">
          <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 sm:gap-2 md:flex">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                      active
                        ? "bg-white/[0.08] text-[#f5ece0]"
                        : "text-[#d9cbb8] hover:bg-white/5 hover:text-[#f5ece0]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "stroke-[2.25]" : "stroke-[1.75]",
                      )}
                      aria-hidden="true"
                    />
                    <span className="hidden lg:inline">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center justify-end gap-2 px-4 sm:gap-3 sm:px-6 lg:relative lg:inset-y-auto lg:right-auto lg:w-72 lg:shrink-0 lg:border-l lg:border-white/5 lg:px-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative size-10 rounded-full text-[#d9cbb8] hover:bg-white/5 hover:text-[#f5ece0] [&_svg]:size-5"
          >
            <Bell strokeWidth={1.75} aria-hidden="true" />
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-[#2a221b]" />
          </Button>

          <label className="relative hidden items-center lg:flex">
            <Search
              className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-[#8a7b69]"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="search people, habits..."
              className="h-10 w-50 rounded-full border-0 bg-[#3a2e25] pl-9 pr-4 text-[#f1e7d9] shadow-none ring-1 ring-inset ring-white/5 placeholder:text-[#8a7b69] focus-visible:ring-2 focus-visible:ring-primary/60"
            />
          </label>

          <Link
            href="/profile"
            aria-label="Your profile"
            aria-current={youActive ? "page" : undefined}
            className={cn(
              "flex items-center rounded-full p-1 transition-colors md:hidden",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
              youActive ? "bg-white/5" : "hover:bg-white/5",
            )}
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                YO
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
};
