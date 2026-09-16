import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { HabitDayList } from "@/components/profile/HabitDayList";
import { Card } from "@/components/ui/card";
import { FEATURES } from "@/lib/flags";
import { getHabitDetail } from "@/lib/habits";
import { getCurrentUser } from "@/lib/user";

type HabitPageProps = {
  params: Promise<{ habitId: string }>;
};

export default async function HabitPage({ params }: HabitPageProps) {
  if (!FEATURES.garden) notFound();

  const { habitId } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const habit = await getHabitDetail(user.id, habitId);
  if (!habit) notFound();

  const stats = [
    { label: "current streak", value: habit.currentStreak, unit: "days" },
    { label: "longest streak", value: habit.longestStreak, unit: "days" },
    { label: "entries", value: habit.completedCount, unit: "total" },
  ];

  return (
    <div className="w-full pb-12 pt-8 lg:px-6 lg:pt-4">
      <div className="space-y-6">
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] lowercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            garden
          </Link>
          <h1 className="mt-3 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
            {habit.name}
          </h1>
          {habit.description ? (
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {habit.description}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                <span className="text-xs text-muted-foreground">
                  {stat.unit}
                </span>
              </p>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-border/70 p-5 shadow-sm lg:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            last four weeks
          </p>
          <h2 className="mt-1.5 font-serif text-xl tracking-tight text-foreground">
            tick off the days you showed up
          </h2>
          <div className="mt-4">
            <HabitDayList habitId={habit.id} days={habit.days} />
          </div>
        </Card>
      </div>
    </div>
  );
}
