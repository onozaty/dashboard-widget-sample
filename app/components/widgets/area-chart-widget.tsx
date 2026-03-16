import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { AreaChartWidgetConfig } from "~/lib/widget-registry";
import { AREA_CHART_SERIES } from "~/services/widget-data.mock";
import type { AreaChartData } from "~/services/widget-data.server";

interface AreaChartWidgetProps {
  config: AreaChartWidgetConfig;
}

export function AreaChartWidget({ config }: AreaChartWidgetProps) {
  const isClient = useIsClient();
  const { data, isLoading } = useWidgetData<AreaChartData[]>(
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
          {AREA_CHART_SERIES.map((s) => (
            <linearGradient
              key={s.key}
              id={`area-${config.id}-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
        {AREA_CHART_SERIES.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            fill={`url(#area-${config.id}-${s.key})`}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
