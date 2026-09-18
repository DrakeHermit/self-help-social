const DAY_MS = 86_400_000;

export const MONTH_NAMES_SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const MONTH_NAMES_LONG = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const WEEKDAY_NAMES_SHORT = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const WEEKDAY_INITIALS = ["su", "mo", "tu", "we", "th", "fr", "sa"];

export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function dayNumber(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISODate(parseISODate(value)) === value;
}

export function relativeDayLabel(iso: string, today: string): string {
  const diff = dayNumber(today) - dayNumber(iso);
  if (diff <= 0) return "today";
  if (diff === 1) return "yesterday";
  return `${diff} days ago`;
}

export function dayHeading(iso: string, today: string): string {
  const diff = dayNumber(today) - dayNumber(iso);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";

  const date = parseISODate(iso);
  const sameYear = date.getFullYear() === parseISODate(today).getFullYear();
  const year = sameYear ? "" : ` ${date.getFullYear()}`;
  return `${WEEKDAY_NAMES_SHORT[date.getDay()]} · ${MONTH_NAMES_SHORT[date.getMonth()]} ${date.getDate()}${year}`;
}

export function monthGrid(year: number, month: number): (string | null)[] {
  const dayCount = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(new Date(year, month, 1).getDay()).fill(
    null,
  );

  for (let day = 1; day <= dayCount; day++) {
    cells.push(toISODate(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}
