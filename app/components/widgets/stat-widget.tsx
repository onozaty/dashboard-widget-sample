import { useWidgetData } from "~/hooks/use-widget-data";
import type { StatWidgetConfig } from "~/lib/widget-registry";
import type { StatData } from "~/services/widget-data.server";

interface StatWidgetProps {
  config: StatWidgetConfig;
}

export function StatWidget({ config }: StatWidgetProps) {
  const { data, isLoading } = useWidgetData<StatData>(
    config.type,
    config.refreshIntervalMs
  );

  if (isLoading && !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        読み込み中...
      </div>
    );
  }

  const value = data?.value ?? 0;
  const previous = data?.previous ?? 0;
  const diff = value - previous;
  const isUp = diff >= 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">{data?.label}</p>
      <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">
        {value.toLocaleString()}
        <span className="ml-1 text-base font-normal">{config.unit}</span>
      </p>
      <p
        className={`flex items-center gap-0.5 text-sm font-medium ${isUp ? "text-green-500" : "text-red-500"}`}
      >
        <span>{isUp ? "▲" : "▼"}</span>
        <span>{Math.abs(diff).toLocaleString()}</span>
        <span className="text-xs font-normal text-gray-400">前回比</span>
      </p>
    </div>
  );
}
