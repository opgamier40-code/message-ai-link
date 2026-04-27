import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp?: string;
}

const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${
          isUser
            ? "bg-primary text-primary-foreground ring-primary/30"
            : "bg-secondary text-secondary-foreground ring-border"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border text-foreground rounded-tl-sm"
          }`}
        >
          {content}
        </div>
        {timestamp && (
          <span className="text-[10px] text-muted-foreground px-1">{timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
