import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { LineChartWidgetConfig } from "~/lib/widget-registry";
import type { LineChartData } from "~/services/widget-data.server";

interface LineChartWidgetProps {
  config: LineChartWidgetConfig;
}

export function LineChartWidget({ config }: LineChartWidgetProps) {
  const isClient = useIsClient();
  const { data, isLoading } = useWidgetData<LineChartData[]>(
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
      <LineChart
        data={data ?? []}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={config.color}
          strokeWidth={2}
          dot={config.showDots}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
