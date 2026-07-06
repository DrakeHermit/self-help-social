import { Card } from "@/components/ui/card";

export type ProfileStatsProps = {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  totalDays: number;
  heldBy: number;
};

type Stat = {
  label: string;
  value: number;
  unit: string;
};

export function ProfileStats({
  currentStreak,
  longestStreak,
  activeDays,
  totalDays,
  heldBy,
}: ProfileStatsProps) {
  const stats: Stat[] = [
    { label: "current streak", value: currentStreak, unit: "days" },
    { label: "longest streak", value: longestStreak, unit: "days" },
    { label: "active days", value: activeDays, unit: `of ${totalDays}` },
    { label: "held by", value: heldBy, unit: "people" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="rounded-2xl border-border/70 p-4 shadow-sm"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="font-serif text-3xl leading-none text-foreground">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.unit}</span>
          </p>
        </Card>
      ))}
    </div>
  );
}
