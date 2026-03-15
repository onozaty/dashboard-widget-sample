import { useEffect, useRef, useState } from "react";
import { useContainerWidth, ResponsiveGridLayout } from "react-grid-layout";
import type { Layout, LayoutItem } from "react-grid-layout";
import { GRID_COLS } from "~/lib/widget-registry";
import { widgetRegistry } from "~/lib/widget-registry";
import type { WidgetConfig } from "~/lib/widget-registry";
import { WidgetShell } from "~/components/widgets/widget-shell";

const GRID_ROWS = 10;
const MARGIN = 8;

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

function useContainerHeight(): [
  number,
  React.RefObject<HTMLDivElement | null>,
] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [height, ref];
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
  const [containerHeight, heightRef] = useContainerHeight();

  // rowHeight: total height minus margins divided by number of rows
  const rowHeight = Math.floor(
    (containerHeight - MARGIN * (GRID_ROWS + 1)) / GRID_ROWS
  );

  const layout: Layout = items;

  return (
    <div ref={heightRef} className="h-full">
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
            rowHeight={rowHeight}
            resizeConfig={{
              enabled: true,
              handles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
            }}
            dragConfig={{
              handle: ".widget-drag-handle",
              enabled: true,
              bounded: false,
              threshold: 3,
            }}
            onLayoutChange={(_layout: Layout, allLayouts) =>
              onLayoutChange(allLayouts.lg ?? layout)
            }
            margin={[MARGIN, MARGIN]}
            containerPadding={[MARGIN, MARGIN]}
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
    </div>
  );
}
