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
    <Card className="-mx-4 rounded-none border-x-0 border-border/70 bg-card py-4 shadow-sm lg:mx-0 lg:w-full lg:rounded-2xl lg:border-x lg:p-6">
      <div className="flex items-baseline justify-between gap-4 px-4 lg:px-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          showing up
        </p>
        <p className="font-mono text-sm lowercase leading-tight tracking-wide text-muted-foreground">
          jan {year} — dec {year}
        </p>
      </div>
      <h2 className="mt-1.5 px-4 font-serif text-xl tracking-tight text-foreground sm:text-2xl lg:px-0">
        a year of small things
      </h2>

      <div className="mt-5">
        <ActivityHeatmapGrid weeks={weeks} monthLabels={monthLabels} />
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
