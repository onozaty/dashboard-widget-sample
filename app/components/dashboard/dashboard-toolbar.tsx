import { useState } from "react";
import type { WidgetType } from "~/lib/widget-registry";

interface DashboardToolbarProps {
  onAddWidget: (type: WidgetType) => void;
  onReset: () => void;
}

const widgetOptions: { type: WidgetType; label: string }[] = [
  { type: "bar-chart", label: "棒グラフ" },
  { type: "line-chart", label: "折れ線グラフ" },
  { type: "message-list", label: "メッセージリスト" },
];

export function DashboardToolbar({
  onAddWidget,
  onReset,
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
                {widgetOptions.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      onAddWidget(type);
                      setOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
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
