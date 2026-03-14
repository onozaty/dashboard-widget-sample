import type { Route } from "./+types/home";
import { DashboardPage } from "~/components/dashboard/dashboard-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ダッシュボード" },
    { name: "description", content: "ウィジェットダッシュボード" },
  ];
}

export default function Home() {
  return <DashboardPage />;
}
