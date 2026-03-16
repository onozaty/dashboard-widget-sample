import { useState } from "react";
import type { Theme } from "~/hooks/use-theme";
import type { WidgetType } from "~/lib/widget-registry";

interface DashboardToolbarProps {
  onAddWidget: (type: WidgetType) => boolean;
  onReset: () => void;
  usedTypes: Set<WidgetType>;
  theme: Theme;
  onToggleTheme: () => void;
}

const widgetOptions: { type: WidgetType; label: string }[] = [
  { type: "stat", label: "数値" },
  { type: "bar-chart", label: "棒グラフ" },
  { type: "line-chart", label: "折れ線グラフ" },
  { type: "area-chart", label: "面グラフ" },
  { type: "pie-chart", label: "円グラフ" },
  { type: "table", label: "テーブル" },
  { type: "message-list", label: "メッセージリスト" },
];

export function DashboardToolbar({
  onAddWidget,
  onReset,
  usedTypes,
  theme,
  onToggleTheme,
}: DashboardToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        ダッシュボード
      </span>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            + ウィジェットを追加
          </button>
          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {widgetOptions.map(({ type, label }) => {
                  const used = usedTypes.has(type);
                  return (
                    <button
                      key={type}
                      disabled={used}
                      onClick={() => {
                        onAddWidget(type);
                        setOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <button
          onClick={onToggleTheme}
          aria-label="テーマ切り替え"
          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06L6.166 6.106z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={onReset}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
