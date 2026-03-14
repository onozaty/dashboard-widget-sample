export interface BarChartData {
  label: string;
  value: number;
}

export interface LineChartData {
  timestamp: string;
  value: number;
}

export interface MessageItem {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  text: string;
}

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
