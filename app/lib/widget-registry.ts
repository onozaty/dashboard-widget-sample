import type { ComponentType } from "react";
import { AreaChartWidget } from "~/components/widgets/area-chart-widget";
import { BarChartWidget } from "~/components/widgets/bar-chart-widget";
import { StatWidget } from "~/components/widgets/stat-widget";
import { LineChartWidget } from "~/components/widgets/line-chart-widget";
import { MessageListWidget } from "~/components/widgets/message-list-widget";
import { PieChartWidget } from "~/components/widgets/pie-chart-widget";
import { TableWidget } from "~/components/widgets/table-widget";

export const GRID_COLS = 12;

export type WidgetType =
  | "bar-chart"
  | "line-chart"
  | "area-chart"
  | "pie-chart"
  | "stat"
  | "message-list"
  | "table";

export interface BaseWidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  refreshIntervalMs: number;
}

export interface BarChartWidgetConfig extends BaseWidgetConfig {
  type: "bar-chart";
  color: string;
}

export interface LineChartWidgetConfig extends BaseWidgetConfig {
  type: "line-chart";
  color: string;
  showDots: boolean;
}

export interface AreaChartWidgetConfig extends BaseWidgetConfig {
  type: "area-chart";
  color: string;
}

export interface PieChartWidgetConfig extends BaseWidgetConfig {
  type: "pie-chart";
}

export interface StatWidgetConfig extends BaseWidgetConfig {
  type: "stat";
  unit: string;
}

export interface MessageListWidgetConfig extends BaseWidgetConfig {
  type: "message-list";
  maxMessages: number;
}

export interface TableWidgetConfig extends BaseWidgetConfig {
  type: "table";
}

export type WidgetConfig =
  | BarChartWidgetConfig
  | LineChartWidgetConfig
  | AreaChartWidgetConfig
  | PieChartWidgetConfig
  | StatWidgetConfig
  | MessageListWidgetConfig
  | TableWidgetConfig;

export interface WidgetProps<T extends WidgetConfig = WidgetConfig> {
  config: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetComponent = ComponentType<WidgetProps<any>>;

export const widgetRegistry: Record<WidgetType, WidgetComponent> = {
  "bar-chart": BarChartWidget,
  "line-chart": LineChartWidget,
  "area-chart": AreaChartWidget,
  "pie-chart": PieChartWidget,
  stat: StatWidget,
  "message-list": MessageListWidget,
  table: TableWidget,
};

export const widgetDefaults: Record<WidgetType, (id: string) => WidgetConfig> =
  {
    "bar-chart": (id) => ({
      id,
      type: "bar-chart",
      title: "棒グラフ",
      refreshIntervalMs: 3000,
      color: "#6366f1",
    }),
    "line-chart": (id) => ({
      id,
      type: "line-chart",
      title: "折れ線グラフ",
      refreshIntervalMs: 5000,
      color: "#22c55e",
      showDots: false,
    }),
    "area-chart": (id) => ({
      id,
      type: "area-chart",
      title: "面グラフ",
      refreshIntervalMs: 5000,
      color: "#f59e0b",
    }),
    "pie-chart": (id) => ({
      id,
      type: "pie-chart",
      title: "円グラフ",
      refreshIntervalMs: 6000,
    }),
    stat: (id) => ({
      id,
      type: "stat",
      title: "数値",
      refreshIntervalMs: 4000,
      unit: "件",
    }),
    "message-list": (id) => ({
      id,
      type: "message-list",
      title: "メッセージ",
      refreshIntervalMs: 4000,
      maxMessages: 20,
    }),
    table: (id) => ({
      id,
      type: "table",
      title: "テーブル",
      refreshIntervalMs: 7000,
    }),
  };

export const widgetDefaultLayouts: Record<
  WidgetType,
  { w: number; h: number; minW: number; minH: number }
> = {
  "bar-chart": { w: 4, h: 5, minW: 2, minH: 2 },
  "line-chart": { w: 6, h: 5, minW: 2, minH: 2 },
  "area-chart": { w: 6, h: 5, minW: 2, minH: 2 },
  "pie-chart": { w: 4, h: 5, minW: 3, minH: 3 },
  stat: { w: 3, h: 3, minW: 2, minH: 2 },
  "message-list": { w: 3, h: 6, minW: 2, minH: 2 },
  table: { w: 6, h: 6, minW: 2, minH: 2 },
};
