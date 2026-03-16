import { data } from "react-router";
import {
  generateAreaChartData,
  generateBarChartData,
  generateGaugeData,
  generateRadarData,
  generateStatData,
  generateLineChartData,
  generateMessages,
  generatePieChartData,
  generateTableData,
} from "~/services/widget-data.server";
import type { Route } from "./+types/api.widget-data";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  switch (type) {
    case "bar-chart":
      return data(generateBarChartData());
    case "line-chart":
      return data(generateLineChartData());
    case "area-chart":
      return data(generateAreaChartData());
    case "pie-chart":
      return data(generatePieChartData());
    case "stat":
      return data(generateStatData());
    case "message-list":
      return data(generateMessages(20));
    case "table":
      return data(generateTableData());
    case "gauge":
      return data(generateGaugeData());
    case "radar":
      return data(generateRadarData());
    default:
      return data({ error: "Unknown widget type" }, { status: 400 });
  }
}
