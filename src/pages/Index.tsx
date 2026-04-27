import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, Calendar, Mail, FileSpreadsheet } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

const WEBHOOK_URL =
  "https://princepatel.app.n8n.cloud/webhook-test/YOURMESSAGE";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prefill, setPrefill] = useState<{ text: string; key: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (data: Record<string, string>) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: data.message,
      timestamp: formatTime(),
    };
    setMessages((prev) => [userMsg, ...prev]);
    setIsLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Response was not JSON");
      }

      const json = await res.json();
      const replyText =
        typeof json === "string"
          ? json
          : json.reply || JSON.stringify(json, null, 2);

      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: replyText,
          timestamp: formatTime(),
        },
        ...prev,
      ]);
    } catch (err) {
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `⚠️ ${err instanceof Error ? err.message : "Something went wrong"}`,
          timestamp: formatTime(),
        },
        ...prev,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/60 backdrop-blur-md">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-md">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-tight">Workflow Assistant</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Online · Powered by n8n
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/60"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-3xl px-4 py-6 flex flex-col-reverse gap-4 min-h-full">
          {isLoading && (
            <div className="flex gap-2.5 animate-fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 text-sm text-muted-foreground shadow-sm">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {messages.length === 0 && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg mb-4">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Ask me to manage your calendar, send emails, or update spreadsheets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-xl">
                {[
                  { icon: Calendar, label: "Schedule a meeting", hint: "for tomorrow at 3pm", prompt: "Schedule a meeting for tomorrow at 3pm" },
                  { icon: Mail, label: "Send an email", hint: "to my team", prompt: "Send an email to my team" },
                  { icon: FileSpreadsheet, label: "Update a sheet", hint: "with new entries", prompt: "Update my spreadsheet with new entries" },
                ].map(({ icon: Icon, label, hint, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPrefill({ text: prompt, key: Date.now() })}
                    className="rounded-xl border border-border bg-card/50 p-3 text-left hover:bg-card hover:border-primary/40 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary mb-2" />
                    <div className="text-xs font-medium text-foreground">{label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default Index;
