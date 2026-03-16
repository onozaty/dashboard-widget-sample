import { useIsClient } from "~/hooks/use-is-client";
import { useWidgetData } from "~/hooks/use-widget-data";
import type { GaugeWidgetConfig } from "~/lib/widget-registry";
import type { GaugeData } from "~/services/widget-data.server";

interface GaugeWidgetProps {
  config: GaugeWidgetConfig;
}

function getColor(pct: number): string {
  if (pct < 50) return "#22c55e";
  if (pct < 80) return "#f59e0b";
  return "#ef4444";
}

const R = 80;
const CX = 110;
const CY = 100;
const STROKE = 16;
const circumference = Math.PI * R; // 半円の弧長

export function GaugeWidget({ config }: GaugeWidgetProps) {
  const isClient = useIsClient();
  const { data, isLoading } = useWidgetData<GaugeData>(
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

  const value = data?.value ?? 0;
  const min = data?.min ?? 0;
  const max = data?.max ?? 100;
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const color = getColor(Math.round(pct * 100));
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <svg viewBox="0 0 220 120" className="w-full max-w-55">
        {/* 背景トラック */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="dark:stroke-gray-700"
        />
        {/* 値バー */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        {/* 値テキスト */}
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          className="fill-gray-800 dark:fill-gray-100"
          fontSize={32}
          fontWeight="bold"
        >
          {value}
          <tspan fontSize={14} fontWeight="normal">{data?.unit}</tspan>
        </text>
        {/* ラベル */}
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400"
          fontSize={11}
        >
          {data?.label}
        </text>
        {/* min / max */}
        <text x={CX - R + 4} y={CY + 20} textAnchor="middle" fontSize={10} className="fill-gray-400">{min}</text>
        <text x={CX + R - 4} y={CY + 20} textAnchor="middle" fontSize={10} className="fill-gray-400">{max}</text>
      </svg>
    </div>
  );
}
