import { useContainerWidth, ResponsiveGridLayout } from "react-grid-layout";
import type { Layout, LayoutItem } from "react-grid-layout";
import { widgetRegistry } from "~/lib/widget-registry";
import type { WidgetConfig } from "~/lib/widget-registry";
import { WidgetShell } from "~/components/widgets/widget-shell";

interface DashboardGridProps {
  items: LayoutItem[];
  configs: Record<string, WidgetConfig>;
  onLayoutChange: (items: readonly LayoutItem[]) => void;
  onRemoveWidget: (id: string) => void;
}

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
          layouts={{ lg: layout, md: layout, sm: layout }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={60}
          dragConfig={{
            handle: ".widget-drag-handle",
            enabled: true,
            bounded: false,
            threshold: 3,
          }}
          onLayoutChange={(_layout: Layout, allLayouts) => {
            const current = allLayouts.lg ?? layout;
            onLayoutChange(current);
          }}
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
