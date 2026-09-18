import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { HabitJournal } from "@/components/profile/HabitJournal";
import { HabitSkeleton } from "@/components/profile/HabitSkeleton";
import { Card } from "@/components/ui/card";
import { todayISO } from "@/lib/dates";
import { FEATURES } from "@/lib/flags";
import { getHabitDetail } from "@/lib/habits";
import { getCurrentUser } from "@/lib/user";

type HabitPageProps = {
  params: Promise<{ habitId: string }>;
};

async function HabitContent({ params }: HabitPageProps) {
  const { habitId } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const habit = await getHabitDetail(user.id, habitId);
  if (!habit) notFound();

  const stats = [
    { label: "current streak", value: habit.currentStreak, unit: "days" },
    { label: "longest streak", value: habit.longestStreak, unit: "days" },
    { label: "entries", value: habit.entryCount, unit: "total" },
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

        <HabitJournal
          habitId={habit.id}
          notes={habit.notes}
          today={todayISO()}
        />
      </div>
    </div>
  );
}

export default function HabitPage({ params }: HabitPageProps) {
  if (!FEATURES.garden) notFound();

  return (
    <Suspense fallback={<HabitSkeleton />}>
      <HabitContent params={params} />
    </Suspense>
  );
}
