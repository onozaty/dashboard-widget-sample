import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { PieChartWidgetConfig } from "~/lib/widget-registry";
import type { PieChartData } from "~/services/widget-data.server";

interface PieChartWidgetProps {
  config: PieChartWidgetConfig;
}

export function PieChartWidget({ config }: PieChartWidgetProps) {
  const isClient = useIsClient();
  const { data, isLoading } = useWidgetData<PieChartData[]>(
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
      <PieChart>
        <Pie
          data={data ?? []}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="60%"
          isAnimationActive={false}
        >
          {(data ?? []).map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
