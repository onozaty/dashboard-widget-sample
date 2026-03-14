import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { AreaChartWidgetConfig } from "~/lib/widget-registry";
import type { LineChartData } from "~/services/widget-data.server";

interface AreaChartWidgetProps {
  config: AreaChartWidgetConfig;
}

export function AreaChartWidget({ config }: AreaChartWidgetProps) {
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
      <AreaChart
        data={data ?? []}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`area-${config.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={config.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke={config.color}
          fill={`url(#area-${config.id})`}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
