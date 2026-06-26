import { connection } from "next/server";

import ActivityHeatmapGrid from "@/components/ActivityHeatmapGrid";
import { Card } from "@/components/ui/card";
import { generateHeatmapGrid, getMonthLabels } from "@/lib/heatmap";

const ActivityHeatmap = async () => {
  await connection();
  const year = new Date().getFullYear();
  const weeks = generateHeatmapGrid(year);
  const monthLabels = getMonthLabels(weeks);

  return (
    <Card className="w-full rounded-2xl border-border/70 bg-card p-6 shadow-sm">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          showing up
        </p>
        <p className="font-mono text-sm lowercase leading-tight tracking-wide text-muted-foreground">
          jan {year} — dec {year}
        </p>
      </div>
      <h2 className="mt-1.5 font-serif text-2xl tracking-tight text-foreground">
        a year of small things
      </h2>

      <div className="mt-5">
        <ActivityHeatmapGrid weeks={weeks} monthLabels={monthLabels} />
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
