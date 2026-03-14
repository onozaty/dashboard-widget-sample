import { data } from "react-router";
import {
  generateBarChartData,
  generateLineChartData,
  generateMessages,
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
    case "message-list":
      return data(generateMessages(20));
    default:
      return data({ error: "Unknown widget type" }, { status: 400 });
  }
}
