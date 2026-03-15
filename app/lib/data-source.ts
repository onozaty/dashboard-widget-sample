import type { WidgetType } from "./widget-registry";

// true にするとモック関数を直接呼び出す（Node不要）
// false にすると /api/widget-data?type=... にfetchする
const USE_MOCK = true;

export async function fetchWidgetData<T>(type: WidgetType): Promise<T> {
  if (USE_MOCK) {
    const mock = await import("~/services/widget-data.mock");
    switch (type) {
      case "bar-chart":
        return mock.generateBarChartData() as T;
      case "line-chart":
        return mock.generateLineChartData() as T;
      case "area-chart":
        return mock.generateAreaChartData() as T;
      case "pie-chart":
        return mock.generatePieChartData() as T;
      case "stat":
        return mock.generateStatData() as T;
      case "message-list":
        return mock.generateMessages(20) as T;
      case "table":
        return mock.generateTableData() as T;
    }
  }

  const res = await fetch(`/api/widget-data?type=${type}`);
  if (!res.ok) throw new Error(`Failed to fetch widget data: ${type}`);
  return res.json() as Promise<T>;
}
