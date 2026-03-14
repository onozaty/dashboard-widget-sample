import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { BarChartWidgetConfig } from "~/lib/widget-registry";
import type { BarChartData } from "~/services/widget-data.server";

interface BarChartWidgetProps {
  config: BarChartWidgetConfig;
}

export function BarChartWidget({ config }: BarChartWidgetProps) {
  const isClient = useIsClient();
  const { data, isLoading } = useWidgetData<BarChartData[]>(
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
      <BarChart
        data={data ?? []}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" fill={config.color} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
