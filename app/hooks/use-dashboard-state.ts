import { useEffect, useState } from "react";
import type { LayoutItem } from "react-grid-layout";
import {
  GRID_COLS,
  widgetDefaults,
  widgetDefaultLayouts,
  type WidgetConfig,
  type WidgetType,
} from "~/lib/widget-registry";

const LAYOUTS_KEY = "dashboard-layouts";
const CONFIGS_KEY = "dashboard-configs";

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
  const [items, setItems] = useState<LayoutItem[]>(() =>
    loadFromStorage<LayoutItem[]>(LAYOUTS_KEY, [])
  );
  const [configs, setConfigs] = useState<Record<string, WidgetConfig>>(() =>
    loadFromStorage<Record<string, WidgetConfig>>(CONFIGS_KEY, {})
  );

  useEffect(() => {
    localStorage.setItem(LAYOUTS_KEY, JSON.stringify(items));
    localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
  }, [items, configs]);

  function addWidget(type: WidgetType) {
    const { w, h, minW, minH } = widgetDefaultLayouts[type];
    const pos = findFreePosition(items, w, h);
    const id = crypto.randomUUID();
    const config = widgetDefaults[type](id);
    const newItem: LayoutItem = { i: id, x: pos.x, y: pos.y, w, h, minW, minH };
    setItems((prev) => [...prev, newItem]);
    setConfigs((prev) => ({ ...prev, [id]: config }));
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
    setItems([]);
    setConfigs({});
  }

  return { items, configs, addWidget, removeWidget, updateLayout, resetLayout };
}
