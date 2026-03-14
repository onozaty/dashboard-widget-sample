import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/widget-data", "routes/api.widget-data.ts"),
] satisfies RouteConfig;
