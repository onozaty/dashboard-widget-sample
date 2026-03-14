# ダッシュボード・ウィジェットシステム 実装計画

## 概要

React Router v7 + React 19 + TypeScript + Tailwind CSS v4 のプロジェクトに、ドラッグ・リサイズ可能なウィジェットパネルを持つダッシュボードを追加する。

ウィジェットのデータは **バックエンドの API から取得**する。React Router v7 の `loader` を使いサーバーサイドでも初期データを取得できる構成とし、SSR は有効のまま維持する。

---

## ライブラリ選定

| 用途 | 選定ライブラリ | 理由 |
|------|---------------|------|
| グリッドレイアウト | `react-grid-layout` v2.2.x | ドラッグ・リサイズ・レスポンシブをワンパッケージで提供。Grafana 等でも採用実績あり |
| チャート | `recharts` v3.8.x | React ネイティブ・SVG ベース・TypeScript 型完備・React 19 対応済み |
| レイアウト永続化 | `useState` + `localStorage` | ページ単一完結のため外部ライブラリ不要。シンプルに useEffect で読み書き |
| SSR | **有効（デフォルト）** | バックエンド API からの初期データを loader で取得し、サーバーレンダリングする |

### 各ライブラリの比較検討

#### グリッドレイアウト

| 候補 | 評価 |
|------|------|
| `react-grid-layout` ✅ | 最も実績あり。ドラッグ・リサイズ・レスポンシブ対応。TypeScript 型あり |
| `@dnd-kit/core` + カスタムグリッド | 柔軟だが、リサイズ・スナップ・グリッド整合を自前実装する必要あり |
| `gridstack.js` | jQuery 時代のライブラリで React との統合が弱い |

#### チャート

| 候補 | 評価 |
|------|------|
| `recharts` ✅ | React コンポーネントとして自然に統合。TypeScript 対応。学習コスト低 |
| `nivo` | 美しいデフォルトスタイル。バンドルサイズが大きく（~200KB gz）複雑 |
| `@visx/visx` | 低レベルなプリミティブ。カスタマイズ性高いが、チャート自体を自組みする必要あり |
| `Chart.js` + `react-chartjs-2` | Canvas ベース。React の宣言的モデルと相性が悪い |

---

## アーキテクチャ概要

```
ブラウザ (React)
  ↕  loader / action (React Router)
サーバー (React Router v7 SSR)
  ↕  fetch / DB アクセス
バックエンド API（サンプルデータを返す）
```

- **レイアウト状態**（どのウィジェットがどこにあるか）: `useState` + `localStorage` で管理（ページ単一完結のためグローバル状態管理ライブラリ不要）
- **ウィジェットデータ**（グラフの値・メッセージ一覧）: バックエンド API から取得
  - 初期表示: React Router の `loader` でサーバーサイドフェッチ → SSR
  - 定期更新: クライアント側でポーリング（`useEffect` + `setInterval`）

---

## ファイル構成

```
app/
  routes/
    home.tsx                           # loader でデータ取得 → dashboard-page にデータを渡す
    api.widget-data.ts                 # クライアントポーリング用 API エンドポイント

  components/
    dashboard/
      dashboard-page.tsx               # ページ最上位コンポーネント
      dashboard-grid.tsx               # react-grid-layout ラッパー
      dashboard-toolbar.tsx            # ウィジェット追加ボタン等
    widgets/
      widget-shell.tsx                 # 共通外枠（ヘッダー・クローズボタン）
      bar-chart-widget.tsx             # 棒グラフウィジェット
      line-chart-widget.tsx            # 折れ線グラフウィジェット
      message-list-widget.tsx          # テキストメッセージリスト

  hooks/
    use-dashboard-state.ts             # レイアウト状態管理フック（useState + localStorage）
    use-widget-data.ts                 # useFetcher でポーリング＋データ取得

  services/
    widget-data.server.ts              # サンプルデータ生成（サーバー専用）

  lib/
    widget-registry.ts                 # ウィジェット型 → コンポーネント マッピング + WidgetConfig 系の型定義

  app.css                              # react-grid-layout の CSS を @import 追加
```

---

## 主要な型定義

型は「使われる場所の近く」に定義する。`types/` ディレクトリは設けない。

### `app/lib/widget-registry.ts` に定義

ウィジェットの設定・種別など、レジストリと密接な型。

```typescript
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
```

### `app/services/widget-data.server.ts` に定義

API レスポンスの型。データ生成関数と同居させる。

```typescript
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
```

### `WidgetLayout` は自前定義不要

react-grid-layout の `Layout` 型をそのまま使う。

---

## データフロー設計

### 初期表示（SSR）

```
1. ユーザーがダッシュボードページにアクセス
2. React Router の loader が実行（サーバー上）
3. loader → widgetData.server.ts → バックエンド API を呼び出す
4. 取得したデータを useLoaderData() 経由でコンポーネントに渡す
5. サーバーでレンダリングしてブラウザに返す
```

### 定期更新（クライアント）

```
1. コンポーネントマウント後、use-widget-data フックが起動
2. useFetcher を取得し、setInterval で refreshIntervalMs ごとに fetcher.load() を呼ぶ
3. fetcher.data が更新されるたびに再レンダリング（fetcher.state でローディング状態も取得可）
```

### API エンドポイント設計

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/widget-data?type=bar-chart` | GET | 棒グラフ用データを返す |
| `/api/widget-data?type=line-chart` | GET | 折れ線グラフ用データを返す |
| `/api/widget-data?type=message-list` | GET | メッセージリストを返す |

現時点ではサーバー側でサンプルデータを生成して返す。将来的に実際の DB やサービスに接続する際はこのエンドポイントの実装を差し替える。

---

## レイアウト状態管理設計

### `useDashboardState` フック

レイアウト状態（どのウィジェットをどこに配置するか）のみを管理する。データ自体はウィジェットコンポーネント内でフェッチする。ページ単一完結のため `useState` で十分で、外部ライブラリは不要。

```typescript
// useDashboardState.ts
function useDashboardState() {
  const [layouts, setLayouts] = useState<WidgetLayout[]>(() => {
    const saved = localStorage.getItem("dashboard-layouts");
    return saved ? JSON.parse(saved) : [];
  });
  const [configs, setConfigs] = useState<Record<string, WidgetConfig>>(() => {
    const saved = localStorage.getItem("dashboard-configs");
    return saved ? JSON.parse(saved) : {};
  });

  // layouts/configs が変わるたびに localStorage へ保存
  useEffect(() => {
    localStorage.setItem("dashboard-layouts", JSON.stringify(layouts));
    localStorage.setItem("dashboard-configs", JSON.stringify(configs));
  }, [layouts, configs]);

  const addWidget = (type: WidgetType) => { /* UUID 生成して追加 */ };
  const removeWidget = (id: string) => { /* layouts/configs から削除 */ };
  const updateLayout = (newLayouts: WidgetLayout[]) => setLayouts(newLayouts);
  const resetLayout = () => { setLayouts([]); setConfigs({}); };

  return { layouts, configs, addWidget, removeWidget, updateLayout, resetLayout };
}
```

- ウィジェット ID は `crypto.randomUUID()` で生成
- SSR 時の `localStorage` アクセスエラーを避けるため、初期化関数内で `typeof window !== "undefined"` をガードする

---

## ウィジェット実装詳細

### WidgetShell（共通外枠）

```
┌──────────────────────────────┐
│ ≡ [タイトル]          [×]   │  ← ドラッグハンドル（.widget-drag-handle）
├──────────────────────────────┤
│                              │
│   ウィジェットコンテンツ      │  ← flex-1 min-h-0
│                              │
└──────────────────────────────┘
```

- `draggableHandle=".widget-drag-handle"` でヘッダーのみドラッグ可能
- コンテンツエリアに `flex-1 min-h-0` → recharts の `height="100%"` が機能する

### デフォルトウィジェットサイズ（12 列グリッド、rowHeight=60px）

| ウィジェット | w | h | minW | minH | 実寸（目安） |
|------------|---|---|------|------|-------------|
| bar-chart  | 4 | 5 | 3    | 4    | ~33% 幅 × 300px 高 |
| line-chart | 6 | 5 | 3    | 4    | ~50% 幅 × 300px 高 |
| message-list | 3 | 6 | 2  | 4    | ~25% 幅 × 360px 高 |

---

## 実装フェーズ

### Phase 1: 基盤設定

**作業内容:**
- パッケージインストール: `react-grid-layout recharts`（react-grid-layout v2.0.0 以降は型定義がパッケージ本体に含まれるため `@types/react-grid-layout` は不要）
- `app/app.css` に react-grid-layout / react-resizable の CSS を `@import` 追加

**変更ファイル:**
- `app/app.css`

### Phase 2: 型定義とストア

**作業内容:**
- 全ウィジェット型インターフェースの定義
- レイアウト状態管理フックの実装（addWidget / removeWidget / updateLayout / resetLayout）
- ウィジェットレジストリの定義

**作成ファイル:**
- `app/hooks/use-dashboard-state.ts`
- `app/lib/widget-registry.ts` — WidgetConfig 系の型定義も含む

### Phase 3: バックエンド API とデータ取得

**作業内容:**
- サーバー側サンプルデータ生成関数の実装
- React Router の resource route として API エンドポイントを実装
- クライアント用ポーリングフックの実装

**作成ファイル:**
- `app/services/widget-data.server.ts` — サンプルデータ生成（サーバー専用）
- `app/routes/api.widget-data.ts` — GET ハンドラ（resource route）
- `app/hooks/use-widget-data.ts` — `useFetcher` + `setInterval` でポーリング＋データ取得

### Phase 4: ウィジェットコンポーネント

**作業内容:**
- 共通外枠（ドラッグハンドル・クローズボタン）
- 各ウィジェット: recharts コンポーネントをラップ、useWidgetData で定期更新

**作成ファイル:**
- `app/components/widgets/widget-shell.tsx`
- `app/components/widgets/bar-chart-widget.tsx`
- `app/components/widgets/line-chart-widget.tsx`
- `app/components/widgets/message-list-widget.tsx`

### Phase 5: ダッシュボード組み立て

**作業内容:**
- react-grid-layout の Responsive コンポーネントでグリッド実装
- ツールバー（ウィジェット追加ドロップダウン・リセットボタン）
- loader で初期データをフェッチし DashboardPage に渡す
- home.tsx を DashboardPage に差し替え

**作成ファイル:**
- `app/components/dashboard/dashboard-grid.tsx`
- `app/components/dashboard/dashboard-toolbar.tsx`
- `app/components/dashboard/dashboard-page.tsx`

**変更ファイル:**
- `app/routes/home.tsx` — loader 追加 + `<DashboardPage />` を使うように変更

### Phase 6: 仕上げ

**作業内容:**
- ページリロード後のレイアウト復元確認
- ウィジェット未追加時の空状態表示
- データ初回取得中のローディングスケルトン
- レスポンシブ対応の確認（sm / md / lg ブレークポイント）

---

## 注意事項・実装上のポイント

### react-grid-layout (v2.2.x)

- CSS は `react-grid-layout/css/styles.css` と `react-resizable/css/styles.css` の両方を import 必須
- `draggableHandle` でドラッグ開始箇所をヘッダーに限定しないと、チャート上でのマウス操作と競合する
- SSR 環境では DOM 計測がサーバーで実行されないため、クライアント側でのみ描画する（`useEffect` 内でレンダリングするか、動的インポートを使う）
- **React 19 との互換性**: 公式は React 18+ 対応。React 19 では key prop に関する警告が出る既知の問題がある（issue #2045）。コミュニティフォークの `react-grid-layout-19` で回避可能だが、まず公式版で試して問題が出た場合に検討する

### recharts (v3.8.x)

- v3.x から React 19 を peerDependencies に明示的に追加済み。`--legacy-peer-deps` 不要
- v3.0 からの主な破壊的変更: `accessibilityLayer` がデフォルト true に変更、`CartesianGrid` が x/yAxisId プロパティを要求
- `<ResponsiveContainer height="100%">` は親要素に具体的な高さが必要。WidgetShell で `flex flex-col` + コンテンツ領域に `flex-1 min-h-0` を設定することで解決
- **SSR 非対応**: `ResponsiveContainer` は ResizeObserver に依存するためサーバーレンダリング不可。`Legend`・`Tooltip`・`XAxis`・`YAxis` も `document` 参照があり SSR でエラーになる。チャートコンポーネントはクライアント側でのみ描画する

### SSR とクライアント専用コード

- react-grid-layout・recharts はどちらも DOM に依存するため、SSR 時にクライアント専用コンポーネントとして扱う
- React Router v7 では `clientLoader` を使うか、コンポーネントレベルで `useEffect` を使って初期レンダリング後に描画する方法が一般的

### useFetcher によるポーリング

- `useFetcher` は React Router のデータフローに乗るため、`fetch` を直接呼ぶより状態管理がシンプルになる
- `fetcher.state` で `"loading"` / `"idle"` を判別できるため、ローディング表示が標準で実現できる
- ポーリングの実装は `setInterval` で `fetcher.load()` を呼ぶだけでよい

```typescript
const fetcher = useFetcher();

useEffect(() => {
  fetcher.load(`/api/widget-data?type=${config.type}`); // 初回即時取得
  const id = setInterval(() => {
    fetcher.load(`/api/widget-data?type=${config.type}`);
  }, config.refreshIntervalMs);
  return () => clearInterval(id);
}, [config.type, config.refreshIntervalMs]);
```

---

## 動作確認方法

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` にアクセスし、以下を確認する:

- [ ] ウィジェットの追加（棒グラフ・折れ線グラフ・メッセージリスト）
- [ ] ドラッグによる位置変更
- [ ] リサイズハンドルによるサイズ変更
- [ ] 削除ボタンによるウィジェット削除
- [ ] データの定期更新（グラフの値・メッセージが変化する）
- [ ] ページリロード後のレイアウト復元
- [ ] レイアウトリセット
