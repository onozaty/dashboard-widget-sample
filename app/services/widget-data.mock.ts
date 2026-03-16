import type {
  AreaChartData,
  AreaChartSeries,
  BarChartData,
  LineChartData,
  MessageItem,
  PieChartData,
  StatData,
  TableData,
} from "./widget-data";

const LABELS = ["月", "火", "水", "木", "金", "土", "日"];

export function generateBarChartData(): BarChartData[] {
  return LABELS.map((label) => ({
    label,
    value: Math.floor(Math.random() * 90) + 10,
  }));
}

export function generateLineChartData(): LineChartData[] {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(now - (19 - i) * 60_000).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Math.floor(Math.random() * 80) + 20,
  }));
}

export const AREA_CHART_SERIES: AreaChartSeries[] = [
  { key: "sales", label: "売上", color: "#f59e0b" },
  { key: "visits", label: "訪問数", color: "#6366f1" },
  { key: "orders", label: "注文数", color: "#22c55e" },
];

export function generateAreaChartData(): AreaChartData[] {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(now - (19 - i) * 60_000).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    sales: Math.floor(Math.random() * 80) + 20,
    visits: Math.floor(Math.random() * 60) + 30,
    orders: Math.floor(Math.random() * 40) + 10,
  }));
}

export function generateStatData(): StatData {
  const value = Math.floor(Math.random() * 9000) + 1000;
  const previous = Math.floor(Math.random() * 9000) + 1000;
  return { value, previous, label: "総リクエスト数" };
}

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
const PIE_LABELS = ["直接", "検索", "SNS", "メール", "その他"];

export function generatePieChartData(): PieChartData[] {
  const total = 100;
  const values = PIE_LABELS.map(() => Math.floor(Math.random() * 30) + 5);
  const sum = values.reduce((a, b) => a + b, 0);
  return PIE_LABELS.map((name, i) => ({
    name,
    value: Math.round((values[i] / sum) * total),
    color: PIE_COLORS[i],
  }));
}

const TABLE_HEADERS = ["ページ", "PV", "UU", "直帰率"];
const TABLE_PAGES = ["/", "/about", "/product", "/contact", "/blog", "/faq"];

export function generateTableData(): TableData {
  return {
    headers: TABLE_HEADERS,
    rows: TABLE_PAGES.map((page) => ({
      ページ: page,
      PV: Math.floor(Math.random() * 5000) + 100,
      UU: Math.floor(Math.random() * 2000) + 50,
      直帰率: `${Math.floor(Math.random() * 60) + 20}%`,
    })),
  };
}

const MESSAGE_TEXTS = [
  "サーバーが正常に起動しました",
  "データベース接続を確立しました",
  "バックアップが完了しました",
  "メモリ使用率が80%を超えました",
  "新しいユーザーが登録されました",
  "APIリクエストのレイテンシが高くなっています",
  "定期メンテナンスが開始されました",
  "エラーログが検出されました",
  "キャッシュをクリアしました",
  "デプロイが完了しました",
];

const LEVELS: MessageItem["level"][] = [
  "info",
  "info",
  "info",
  "warn",
  "error",
];

export function generateMessages(maxMessages: number): MessageItem[] {
  const count = Math.min(maxMessages, MESSAGE_TEXTS.length);
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - i * 30_000).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    level: LEVELS[Math.floor(Math.random() * LEVELS.length)],
    text: MESSAGE_TEXTS[Math.floor(Math.random() * MESSAGE_TEXTS.length)],
  }));
}
