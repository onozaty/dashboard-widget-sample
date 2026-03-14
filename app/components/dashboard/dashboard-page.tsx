import { useDashboardState } from "~/hooks/use-dashboard-state";
import { DashboardGrid } from "./dashboard-grid";
import { DashboardToolbar } from "./dashboard-toolbar";

export function DashboardPage() {
  const {
    items,
    configs,
    usedTypes,
    addWidget,
    removeWidget,
    updateLayout,
    resetLayout,
  } = useDashboardState();

  const isEmpty = items.length === 0;

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <DashboardToolbar
        onAddWidget={addWidget}
        onReset={resetLayout}
        usedTypes={usedTypes}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <p className="text-sm">ウィジェットがありません</p>
            <p className="text-xs">
              「ウィジェットを追加」から追加してください
            </p>
          </div>
        ) : (
          <DashboardGrid
            items={items}
            configs={configs}
            onLayoutChange={updateLayout}
            onRemoveWidget={removeWidget}
          />
        )}
      </div>
    </div>
  );
}
