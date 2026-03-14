import { useEffect } from "react";
import { useFetcher } from "react-router";
import type { WidgetType } from "~/lib/widget-registry";

export function useWidgetData<T>(type: WidgetType, refreshIntervalMs: number) {
  const fetcher = useFetcher<T>();

  useEffect(() => {
    const url = `/api/widget-data?type=${type}`;
    fetcher.load(url);

    const id = setInterval(() => {
      fetcher.load(url);
    }, refreshIntervalMs);

    return () => clearInterval(id);
    // fetcher を deps に含めると無限ループになるため意図的に除外
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, refreshIntervalMs]);

  return {
    data: fetcher.data as T | undefined,
    isLoading: fetcher.state === "loading",
  };
}
