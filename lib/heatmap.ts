export type Level = 0 | 1 | 2 | 3 | 4 | 5;

export type DayCell = {
  date: string; 
  count: number; 
};

export type GridCell = DayCell | null;

const DAYS_PER_WEEK = 7;

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toLocalISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function countToLevel(count: number): Level {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  if (count <= 8) return 4;
  return 5;
}

export function generateHeatmapGrid(
  year: number = new Date().getFullYear(),
): GridCell[][] {
  const start = new Date(year, 0, 1);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(year, 11, 31);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const grid: GridCell[][] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const week: GridCell[] = [];
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      if (cursor.getFullYear() === year) {
        week.push({ date: toLocalISODate(cursor), count: 0 });
      } else {
        week.push(null);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.push(week);
  }

  return grid;
}

export function getMonthLabels(weeks: GridCell[][]): string[] {
  return weeks.map((week) => {
    const firstOfMonth = week.find(
      (day) => day && day.date.slice(8, 10) === "01",
    );
    if (!firstOfMonth) {
      return "";
    }
    return MONTH_NAMES[Number(firstOfMonth.date.slice(5, 7)) - 1];
  });
}
