import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSubmit: (data: Record<string, string>) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [clientDate, setClientDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userId.trim() || isLoading) return;
    onSubmit({
      message: message.trim(),
      user_id: userId.trim(),
      timezone: timezone.trim(),
      client_date: clientDate,
    });
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {/* Collapsible settings row */}
      {showSettings && (
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2 animate-fade-in">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID *"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            disabled={isLoading}
          />
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Timezone"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            disabled={isLoading}
          />
          <input
            type="date"
            value={clientDate}
            onChange={(e) => setClientDate(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            disabled={isLoading}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`shrink-0 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
            showSettings
              ? "border-primary bg-primary/10 text-primary"
              : "border-input bg-background text-muted-foreground hover:text-foreground"
          }`}
          title="Toggle settings"
        >
          ⚙
        </button>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={userId.trim() ? "Type a message…" : "Set User ID in ⚙ first, then type…"}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 max-h-32 overflow-y-auto"
          disabled={isLoading}
          style={{ minHeight: "42px" }}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim() || !userId.trim()}
          className="shrink-0 flex items-center justify-center rounded-lg bg-primary p-2.5 text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
