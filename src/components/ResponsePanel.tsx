import { AlertCircle, RotateCcw, Inbox } from "lucide-react";

interface ResponsePanelProps {
  data: Record<string, string> | null;
  error: string | null;
  onReset: () => void;
}

const ResponsePanel = ({ data, error, onReset }: ResponsePanelProps) => {
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-2">
        <Inbox className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">No data returned.</p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Run again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 font-mono">
              {key}
            </p>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mx-auto"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Run again
      </button>
    </div>
  );
};

export default ResponsePanel;
