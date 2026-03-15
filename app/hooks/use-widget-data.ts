import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWidgetData } from "~/lib/data-source";
import type { WidgetType } from "~/lib/widget-registry";

export function useWidgetData<T>(type: WidgetType, refreshIntervalMs: number) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchWidgetData<T>(type).then((result) => {
      if (!controller.signal.aborted) {
        setData(result);
        setIsLoading(false);
      }
    }).catch(() => {
      // abort による中断は無視する
    });
  }, [type]);

  useEffect(() => {
    const id = setInterval(load, refreshIntervalMs);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [load, refreshIntervalMs]);

  // 初回ロード（マウント時・type変更時）
  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading };
}
