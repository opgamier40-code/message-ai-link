import { useState } from "react";
import { Zap } from "lucide-react";
import MessageForm from "@/components/MessageForm";
import ResponsePanel from "@/components/ResponsePanel";

const WEBHOOK_URL =
  "https://princepatel.app.n8n.cloud/webhook-test/YOURMESSAGE";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Response was not JSON");
      }

      const json = await res.json();
      setResponse(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Workflow Assistant
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Send a message to your n8n workflow and get a response.
          </p>
        </header>

        {/* Form Card */}
        <section className="rounded-2xl border border-border bg-card shadow-md p-6 sm:p-8">
          <MessageForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Response */}
        {(response || error) && (
          <section className="mt-6">
            <ResponsePanel
              data={response}
              error={error}
              onReset={handleReset}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
