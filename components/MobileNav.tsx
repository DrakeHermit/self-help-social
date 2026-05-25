"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Target, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MobileNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Find", href: "/discover", icon: Compass },
  { label: "Habits", href: "/habits", icon: Target },
  { label: "Partners", href: "/partners", icon: Users },
  { label: "You", href: "/profile", icon: User },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const MobileNav = () => {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#2a221b] text-[#f1e7d9] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-16 grid-cols-5 items-stretch">
        {MOBILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset",
                  active
                    ? "text-primary"
                    : "text-[#9a8a78] hover:text-[#f5ece0]",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "stroke-[2.25]" : "stroke-[1.75]",
                  )}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
