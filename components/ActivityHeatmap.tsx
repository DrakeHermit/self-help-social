import { connection } from "next/server";

import ActivityHeatmapGrid from "@/components/ActivityHeatmapGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateHeatmapGrid, getMonthLabels } from "@/lib/heatmap";

const ActivityHeatmap = async () => {
  await connection();
  const year = new Date().getFullYear();
  const weeks = generateHeatmapGrid(year);
  const monthLabels = getMonthLabels(weeks);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          Your habit activity in {year}. Each square is a day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityHeatmapGrid weeks={weeks} monthLabels={monthLabels} />
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;
