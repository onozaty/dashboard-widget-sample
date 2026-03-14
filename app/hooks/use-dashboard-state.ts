import { useEffect, useState } from "react";
import type { LayoutItem } from "react-grid-layout";
import {
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
    const id = crypto.randomUUID();
    const config = widgetDefaults[type](id);
    const { w, h, minW, minH } = widgetDefaultLayouts[type];

    const maxY = items.reduce((acc, l) => Math.max(acc, l.y + l.h), 0);

    const newItem: LayoutItem = { i: id, x: 0, y: maxY, w, h, minW, minH };
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
