import { useContainerWidth, ResponsiveGridLayout } from "react-grid-layout";
import type { Layout, LayoutItem } from "react-grid-layout";
import { GRID_COLS } from "~/lib/widget-registry";
import { widgetRegistry } from "~/lib/widget-registry";
import type { WidgetConfig } from "~/lib/widget-registry";
import { WidgetShell } from "~/components/widgets/widget-shell";

interface DashboardGridProps {
  items: LayoutItem[];
  configs: Record<string, WidgetConfig>;
  onLayoutChange: (items: readonly LayoutItem[]) => void;
  onRemoveWidget: (id: string) => void;
}

const COLS = {
  lg: GRID_COLS,
  md: GRID_COLS,
  sm: GRID_COLS,
  xs: GRID_COLS,
  xxs: GRID_COLS,
};

export function DashboardGrid({
  items,
  configs,
  onLayoutChange,
  onRemoveWidget,
}: DashboardGridProps) {
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });

  const layout: Layout = items;

  return (
    <div ref={containerRef}>
      {mounted && (
        <ResponsiveGridLayout
          width={width}
          layouts={{
            lg: layout,
            md: layout,
            sm: layout,
            xs: layout,
            xxs: layout,
          }}
          cols={COLS}
          rowHeight={60}
          dragConfig={{
            handle: ".widget-drag-handle",
            enabled: true,
            bounded: false,
            threshold: 3,
          }}
          onLayoutChange={(_layout: Layout, allLayouts) =>
            onLayoutChange(allLayouts.lg ?? layout)
          }
          margin={[8, 8]}
          containerPadding={[8, 8]}
        >
          {items.map((item) => {
            const config = configs[item.i];
            if (!config) return null;
            const WidgetComponent = widgetRegistry[config.type];
            if (!WidgetComponent) return null;

            return (
              <div key={item.i}>
                <WidgetShell
                  title={config.title}
                  onRemove={() => onRemoveWidget(item.i)}
                >
                  <WidgetComponent config={config} />
                </WidgetShell>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
