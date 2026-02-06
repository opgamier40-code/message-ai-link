import { useState, useRef, useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

const WEBHOOK_URL =
  "https://princepatel.app.n8n.cloud/webhook-test/YOURMESSAGE";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, [messages]);

  const handleSubmit = async (data: Record<string, string>) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: data.message,
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

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: replyText,
      };
      setMessages((prev) => [aiMsg, ...prev]);
    } catch (err) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `⚠️ ${err instanceof Error ? err.message : "Something went wrong"}`,
      };
      setMessages((prev) => [aiMsg, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Workflow Assistant</h1>
          <p className="text-xs text-muted-foreground">Powered by n8n</p>
        </div>
      </header>

      {/* Chat area — newest first (flex-col-reverse for natural scroll) */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col-reverse px-4 py-4 gap-3"
      >
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-2.5 text-sm text-muted-foreground">
              Thinking…
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm">
            <p>Send a message to start the conversation.</p>
          </div>
        )}
      </div>

      {/* Input fixed at bottom */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default Index;
