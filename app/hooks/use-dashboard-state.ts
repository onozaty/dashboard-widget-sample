import { useEffect, useState } from "react";
import type { LayoutItem } from "react-grid-layout";
import {
  GRID_COLS,
  widgetDefaultLayouts,
  widgetDefaults,
  type WidgetConfig,
  type WidgetType,
} from "~/lib/widget-registry";

const LAYOUTS_KEY = "dashboard-layouts";
const CONFIGS_KEY = "dashboard-configs";

// デフォルト配置: 12列×10行に7種類を敷き詰める
const DEFAULT_PLACEMENTS: {
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
}[] = [
  { type: "stat", x: 0, y: 0, w: 3, h: 3 },
  { type: "bar-chart", x: 3, y: 0, w: 5, h: 3 },
  { type: "line-chart", x: 8, y: 0, w: 4, h: 5 },
  { type: "pie-chart", x: 0, y: 3, w: 3, h: 4 },
  { type: "area-chart", x: 3, y: 4, w: 5, h: 4 },
  { type: "message-list", x: 8, y: 5, w: 4, h: 5 },
  { type: "table", x: 0, y: 7, w: 8, h: 3 },
];

function buildDefaultState(): {
  items: LayoutItem[];
  configs: Record<string, WidgetConfig>;
} {
  const items: LayoutItem[] = [];
  const configs: Record<string, WidgetConfig> = {};
  for (const p of DEFAULT_PLACEMENTS) {
    const id = crypto.randomUUID();
    const { minW, minH } = widgetDefaultLayouts[p.type];
    items.push({ i: id, x: p.x, y: p.y, w: p.w, h: p.h, minW, minH });
    configs[id] = widgetDefaults[p.type](id);
  }
  return { items, configs };
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function findFreePosition(
  items: LayoutItem[],
  w: number,
  h: number
): { x: number; y: number } {
  const occupied = new Set<string>();
  for (const item of items) {
    for (let row = item.y; row < item.y + item.h; row++) {
      for (let col = item.x; col < item.x + item.w; col++) {
        occupied.add(`${col},${row}`);
      }
    }
  }
  for (let row = 0; row < 1000; row++) {
    for (let col = 0; col + w <= GRID_COLS; col++) {
      let fits = true;
      outer: for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          if (occupied.has(`${col + dc},${row + dr}`)) {
            fits = false;
            break outer;
          }
        }
      }
      if (fits) return { x: col, y: row };
    }
  }
  return { x: 0, y: 0 };
}

export function useDashboardState() {
  const [items, setItems] = useState<LayoutItem[]>(() => {
    const saved = loadFromStorage<LayoutItem[] | null>(LAYOUTS_KEY, null);
    return saved ?? buildDefaultState().items;
  });
  const [configs, setConfigs] = useState<Record<string, WidgetConfig>>(() => {
    const saved = loadFromStorage<Record<string, WidgetConfig> | null>(
      CONFIGS_KEY,
      null
    );
    return saved ?? buildDefaultState().configs;
  });

  useEffect(() => {
    localStorage.setItem(LAYOUTS_KEY, JSON.stringify(items));
    localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
  }, [items, configs]);

  const usedTypes = new Set(Object.values(configs).map((c) => c.type));

  function addWidget(type: WidgetType): boolean {
    if (usedTypes.has(type)) return false;
    const { w, h, minW, minH } = widgetDefaultLayouts[type];
    const pos = findFreePosition(items, w, h);
    const id = crypto.randomUUID();
    const config = widgetDefaults[type](id);
    const newItem: LayoutItem = { i: id, x: pos.x, y: pos.y, w, h, minW, minH };
    setItems((prev) => [...prev, newItem]);
    setConfigs((prev) => ({ ...prev, [id]: config }));
    return true;
  }

  function removeWidget(id: string) {
    setItems((prev) => prev.filter((l) => l.i !== id));
    setConfigs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateLayout(newItems: readonly LayoutItem[]) {
    setItems([...newItems]);
  }

  function resetLayout() {
    const { items: defaultItems, configs: defaultConfigs } =
      buildDefaultState();
    setItems(defaultItems);
    setConfigs(defaultConfigs);
  }

  return {
    items,
    configs,
    usedTypes,
    addWidget,
    removeWidget,
    updateLayout,
    resetLayout,
  };
}
