import type { ComponentType } from "react";
import { BarChartWidget } from "~/components/widgets/bar-chart-widget";
import { LineChartWidget } from "~/components/widgets/line-chart-widget";
import { MessageListWidget } from "~/components/widgets/message-list-widget";

export type WidgetType = "bar-chart" | "line-chart" | "message-list";

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

export interface MessageListWidgetConfig extends BaseWidgetConfig {
  type: "message-list";
  maxMessages: number;
}

export type WidgetConfig =
  | BarChartWidgetConfig
  | LineChartWidgetConfig
  | MessageListWidgetConfig;

export interface WidgetProps<T extends WidgetConfig = WidgetConfig> {
  config: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetComponent = ComponentType<WidgetProps<any>>;

export const widgetRegistry: Record<WidgetType, WidgetComponent> = {
  "bar-chart": BarChartWidget,
  "line-chart": LineChartWidget,
  "message-list": MessageListWidget,
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
    "message-list": (id) => ({
      id,
      type: "message-list",
      title: "メッセージ",
      refreshIntervalMs: 4000,
      maxMessages: 20,
    }),
  };

export const widgetDefaultLayouts: Record<
  WidgetType,
  { w: number; h: number; minW: number; minH: number }
> = {
  "bar-chart": { w: 4, h: 5, minW: 3, minH: 4 },
  "line-chart": { w: 6, h: 5, minW: 3, minH: 4 },
  "message-list": { w: 3, h: 6, minW: 2, minH: 4 },
};
