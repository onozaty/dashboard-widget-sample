import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes: RouteConfig = [index("routes/home.tsx")];

// SPAモード（ssr: false）では loader を持つルートは使えないため除外する
// バックエンドと接続する際は react-router.config.ts で ssr: true に戻すこと
if (process.env.NODE_ENV !== "production") {
  routes.push(route("api/widget-data", "routes/api.widget-data.ts"));
}

export default routes satisfies RouteConfig;
