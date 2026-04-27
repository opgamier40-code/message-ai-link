import { useState } from "react";
import { Send, Loader2, Settings2 } from "lucide-react";

interface ChatInputProps {
  onSubmit: (data: Record<string, string>) => void;
  isLoading: boolean;
  prefill?: string;
}

const ChatInput = ({ onSubmit, isLoading, prefill }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  // Sync prefill from parent
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => {});
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
    <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-3">
      <div className="mx-auto max-w-3xl">
        {showSettings && (
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2 animate-fade-in">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">User ID *</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. user_123"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</label>
              <input
                type="date"
                value={clientDate}
                onChange={(e) => setClientDate(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition"
        >
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`shrink-0 flex items-center justify-center rounded-lg p-2 transition-colors ${
              showSettings
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
            title="Settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={userId.trim() ? "Message Workflow Assistant…" : "Set User ID in settings to begin…"}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm placeholder:text-muted-foreground focus:outline-none max-h-32 overflow-y-auto"
            disabled={isLoading}
            style={{ minHeight: "36px" }}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim() || !userId.trim()}
            className="shrink-0 flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Press <kbd className="px-1 py-0.5 rounded bg-secondary/60 font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-secondary/60 font-mono">Shift + Enter</kbd> for newline
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
