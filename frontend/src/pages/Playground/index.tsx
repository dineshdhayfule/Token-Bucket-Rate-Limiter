import { useState, useCallback } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import GlassCard from "@/components/common/GlassCard";
import StatusBadge from "@/components/common/StatusBadge";
import { useCheckRateLimit } from "@/hooks/use-rate-limiter";
import { ClientType } from "@/types";
import type { RateLimitHistoryEntry, RateLimitResponse } from "@/types";
import { generateMockHistoryEntry } from "@/services/mock-data";

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: ClientType.API_KEY, label: "API Key" },
  { value: ClientType.JWT, label: "JWT" },
  { value: ClientType.IP, label: "IP Address" },
  { value: ClientType.USER, label: "Custom Client" },
];

export default function Playground() {
  const [clientType, setClientType] = useState<ClientType>(ClientType.API_KEY);
  const [clientId, setClientId] = useState("sk-proj-abc123");
  const [requestCount, setRequestCount] = useState(1);
  const [currentResponse, setCurrentResponse] = useState<RateLimitResponse | null>(null);
  const [history, setHistory] = useState<RateLimitHistoryEntry[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const checkMutation = useCheckRateLimit();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!clientId.trim()) return;

      if (requestCount === 1) {
        checkMutation.mutate(
          { type: clientType, id: clientId },
          {
            onSuccess: (result) => {
              setCurrentResponse(result);
              setHistory((prev) => [
                { id: `h-${Date.now()}`, ...result },
                ...prev,
              ]);
            },
          }
        );
      } else {
        // Batch requests
        setIsBatchRunning(true);
        setBatchProgress(0);
        for (let i = 0; i < requestCount; i++) {
          const entry = generateMockHistoryEntry(clientType, clientId);
          setCurrentResponse(entry);
          setHistory((prev) => [entry, ...prev]);
          setBatchProgress(i + 1);
          // Small delay between requests
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        setIsBatchRunning(false);
      }
    },
    [clientType, clientId, requestCount, checkMutation]
  );

  const isLoading = checkMutation.isPending || isBatchRunning;

  return (
    <AnimatedPage>
      <PageHeader
        title="Rate Limit Tester"
        description="Test rate limiting by sending requests to the backend"
        actions={
          history.length > 0 ? (
            <button
              onClick={() => {
                setHistory([]);
                setCurrentResponse(null);
              }}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Trash2 className="h-3 w-3" />
              Clear History
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Left: Request Form ── */}
        <GlassCard>
          <h3 className="mb-5 text-sm font-medium text-foreground">Request Configuration</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Client Type */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Client Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CLIENT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setClientType(opt.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      clientType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Identifier */}
            <div>
              <label
                htmlFor="clientId"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                Client Identifier
              </label>
              <input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client ID"
                className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            {/* Request Count */}
            <div>
              <label
                htmlFor="requestCount"
                className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground"
              >
                <span>Request Count</span>
                <span className="text-muted-foreground">{requestCount}</span>
              </label>
              <input
                id="requestCount"
                type="range"
                min={1}
                max={50}
                value={requestCount}
                onChange={(e) => setRequestCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>1</span>
                <span>50</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !clientId.trim()}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isBatchRunning
                    ? `Sending ${batchProgress}/${requestCount}...`
                    : "Checking..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Check Rate Limit
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* ── Right: Response Card ── */}
        <GlassCard>
          <h3 className="mb-5 text-sm font-medium text-foreground">Response</h3>

          {!currentResponse && !isLoading && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Send className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Send a request to see the response
              </p>
            </div>
          )}

          {isLoading && !currentResponse && (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {currentResponse && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <StatusBadge
                  variant={currentResponse.allowed ? "allowed" : "blocked"}
                  className="text-sm"
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(currentResponse.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Remaining Tokens",
                    value: currentResponse.tokensRemaining,
                  },
                  {
                    label: "Bucket Capacity",
                    value: currentResponse.capacity,
                  },
                  {
                    label: "Refill Rate",
                    value: `${currentResponse.refillRate}/s`,
                  },
                  {
                    label: "Latency",
                    value: `${currentResponse.latencyMs}ms`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg bg-secondary/30 p-3"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Token bar */}
              <div>
                <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>Token usage</span>
                  <span>
                    {currentResponse.tokensRemaining} / {currentResponse.capacity}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary/50">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (currentResponse.tokensRemaining / currentResponse.capacity) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── History Table ── */}
      {history.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-medium text-foreground">
              Request History
              <span className="ml-2 text-xs text-muted-foreground">
                ({history.length})
              </span>
            </h3>
          </div>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tokens
                  </th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Latency
                  </th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((entry) => (
                  <tr
                    key={entry.id}
                    className="transition-colors hover:bg-secondary/20"
                  >
                    <td className="px-5 py-2.5">
                      <StatusBadge
                        variant={entry.allowed ? "allowed" : "blocked"}
                      />
                    </td>
                    <td className="px-5 py-2.5 font-mono text-xs text-foreground">
                      {entry.clientId}
                    </td>
                    <td className="px-5 py-2.5 text-xs text-muted-foreground">
                      {entry.tokensRemaining} / {entry.capacity}
                    </td>
                    <td className="px-5 py-2.5 text-xs text-muted-foreground">
                      {entry.latencyMs}ms
                    </td>
                    <td className="px-5 py-2.5 text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
