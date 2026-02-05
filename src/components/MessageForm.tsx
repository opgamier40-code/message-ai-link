import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface MessageFormProps {
  onSubmit: (data: Record<string, string>) => void;
  isLoading: boolean;
}

const MessageForm = ({ onSubmit, isLoading }: MessageFormProps) => {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [clientDate, setClientDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!message.trim()) newErrors.message = "Message is required";
    if (message.trim().length > 2000) newErrors.message = "Message must be under 2000 characters";
    if (!userId.trim()) newErrors.user_id = "User ID is required";
    if (userId.trim().length > 100) newErrors.user_id = "User ID must be under 100 characters";
    if (!timezone.trim()) newErrors.timezone = "Timezone is required";
    if (!clientDate) newErrors.client_date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      message: message.trim(),
      user_id: userId.trim(),
      timezone: timezone.trim(),
      client_date: clientDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about tasks, reminders, or actions…"
          rows={4}
          className="w-full rounded-lg border border-input bg-surface-elevated px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all resize-none"
          disabled={isLoading}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      {/* Row: User ID + Timezone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="user_id" className="text-sm font-medium text-foreground">
            User ID
          </label>
          <input
            id="user_id"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Unique user identifier"
            className="w-full rounded-lg border border-input bg-surface-elevated px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
            disabled={isLoading}
          />
          {errors.user_id && (
            <p className="text-xs text-destructive">{errors.user_id}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="timezone" className="text-sm font-medium text-foreground">
            User Timezone
          </label>
          <input
            id="timezone"
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Asia/Kolkata"
            className="w-full rounded-lg border border-input bg-surface-elevated px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
            disabled={isLoading}
          />
          {errors.timezone && (
            <p className="text-xs text-destructive">{errors.timezone}</p>
          )}
        </div>
      </div>

      {/* Client Date */}
      <div className="space-y-1.5">
        <label htmlFor="client_date" className="text-sm font-medium text-foreground">
          Client Date
        </label>
        <input
          id="client_date"
          type="date"
          value={clientDate}
          onChange={(e) => setClientDate(e.target.value)}
          className="w-full rounded-lg border border-input bg-surface-elevated px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
          disabled={isLoading}
        />
        {errors.client_date && (
          <p className="text-xs text-destructive">{errors.client_date}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default MessageForm;
