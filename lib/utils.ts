import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return "?";
  const dot = local.indexOf(".");
  const second = dot !== -1 ? (local[dot + 1] ?? "") : "";
  return (local[0] + second).toUpperCase();
}
