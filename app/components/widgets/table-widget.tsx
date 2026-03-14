import { useWidgetData } from "~/hooks/use-widget-data";
import type { TableWidgetConfig } from "~/lib/widget-registry";
import type { TableData } from "~/services/widget-data.server";

interface TableWidgetProps {
  config: TableWidgetConfig;
}

export function TableWidget({ config }: TableWidgetProps) {
  const { data, isLoading } = useWidgetData<TableData>(
    config.type,
    config.refreshIntervalMs
  );

  if (isLoading && !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        読み込み中...
      </div>
    );
  }

  const headers = data?.headers ?? [];
  const rows = data?.rows ?? [];

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-300"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {headers.map((h) => (
                <td
                  key={h}
                  className="px-2 py-1.5 text-gray-700 dark:text-gray-300"
                >
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
