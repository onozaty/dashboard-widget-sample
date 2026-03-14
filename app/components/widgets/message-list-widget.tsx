import { useWidgetData } from "~/hooks/use-widget-data";
import type { MessageListWidgetConfig } from "~/lib/widget-registry";
import type { MessageItem } from "~/services/widget-data.server";

interface MessageListWidgetProps {
  config: MessageListWidgetConfig;
}

const levelStyles: Record<MessageItem["level"], string> = {
  info: "text-blue-600 dark:text-blue-400",
  warn: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
};

const levelLabels: Record<MessageItem["level"], string> = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

export function MessageListWidget({ config }: MessageListWidgetProps) {
  const { data, isLoading } = useWidgetData<MessageItem[]>(
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

  const messages = data ?? [];

  return (
    <ul className="h-full overflow-y-auto space-y-1">
      {messages.map((msg) => (
        <li key={msg.id} className="flex gap-2 text-xs">
          <span className="shrink-0 text-gray-400">{msg.timestamp}</span>
          <span
            className={`shrink-0 font-mono font-bold ${levelStyles[msg.level]}`}
          >
            {levelLabels[msg.level]}
          </span>
          <span className="text-gray-700 dark:text-gray-300">{msg.text}</span>
        </li>
      ))}
    </ul>
  );
}
