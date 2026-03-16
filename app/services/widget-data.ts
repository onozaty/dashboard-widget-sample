// 型定義（サーバー・クライアント共用）
export interface BarChartData {
  label: string;
  value: number;
}

export interface LineChartData {
  timestamp: string;
  value: number;
}

export interface AreaChartData {
  timestamp: string;
  [series: string]: string | number;
}

export interface AreaChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface MessageItem {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  text: string;
}

export interface StatData {
  value: number;
  previous: number;
  label: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface TableRow {
  [key: string]: string | number;
}

export interface TableData {
  headers: string[];
  rows: TableRow[];
}
