import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { RadarWidgetConfig } from "~/lib/widget-registry";
import type { RadarData } from "~/services/widget-data.server";

interface RadarWidgetProps {
  config: RadarWidgetConfig;
}

export function RadarWidget({ config }: RadarWidgetProps) {
  const isClient = useIsClient();
  const { data, isLoading } = useWidgetData<RadarData[]>(
    config.type,
    config.refreshIntervalMs
  );

  if (!isClient) return null;

  if (isLoading && !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        読み込み中...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data ?? []}>
        <PolarGrid
          stroke="#e5e7eb"
          className="dark:[&>line]:stroke-gray-700 dark:[&>circle]:stroke-gray-700"
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-gray-600 dark:text-gray-400"
        />
        <Tooltip />
        <Radar
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
