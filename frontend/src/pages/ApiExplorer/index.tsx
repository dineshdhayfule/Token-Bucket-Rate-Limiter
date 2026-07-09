import { useState, useEffect, useRef, useMemo } from "react";
import { Loader2, Send, Copy, Check, History, Trash2, Globe, FileCode, AlertCircle, RefreshCcw, ChevronDown } from "lucide-react";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import GlassCard from "@/components/common/GlassCard";
import StatusBadge from "@/components/common/StatusBadge";
import { api } from "@/config/axios";
import { cn } from "@/utils/utils";
import axios from "axios";

type HttpMethod = "GET" | "POST" | "DELETE";

interface EndpointDef {
  method: HttpMethod;
  path: string;
  label: string;
  params?: { key: string; defaultValue: string }[];
}

const ENDPOINTS: EndpointDef[] = [
  { method: "GET", path: "/api/check", label: "Check Rate Limit", params: [{ key: "type", defaultValue: "API_KEY" }, { key: "id", defaultValue: "sk-proj-abc123" }] },
  { method: "GET", path: "/admin/buckets", label: "Get All Buckets" },
  { method: "GET", path: "/admin/users", label: "Get All Users" },
  { method: "GET", path: "/admin/bucket", label: "Get Bucket", params: [{ key: "type", defaultValue: "API_KEY" }, { key: "id", defaultValue: "sk-proj-abc123" }] },
  { method: "DELETE", path: "/admin/bucket", label: "Delete Bucket", params: [{ key: "type", defaultValue: "API_KEY" }, { key: "id", defaultValue: "sk-proj-abc123" }] },
  { method: "POST", path: "/admin/reset", label: "Reset All Buckets" },
];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-success",
  POST: "text-primary",
  DELETE: "text-destructive",
};

interface RequestHistoryItem {
  id: string;
  method: HttpMethod;
  path: string;
  timestamp: number;
  status: number;
  params: Record<string, string>;
  headers: Record<string, string>;
}

interface ParsedResponse {
  status: number;
  statusText: string;
  latencyMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  data: unknown;
  isHtmlError: boolean;
  isOffline: boolean;
}

export default function ApiExplorer() {
  // Request State
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [params, setParams] = useState<Record<string, string>>(Object.fromEntries((ENDPOINTS[0].params ?? []).map((p) => [p.key, p.defaultValue])));
  const [headers, setHeaders] = useState<Record<string, string>>({});
  
  // Custom headers/params UI state
  const [newParamKey, setNewParamKey] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [newHeaderKey, setNewHeaderKey] = useState("");
  const [newHeaderValue, setNewHeaderValue] = useState("");

  // Response & Execution State
  const [response, setResponse] = useState<ParsedResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // History State
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Copy States
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Load History
  useEffect(() => {
    try {
      const stored = localStorage.getItem("api-playground-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  function saveHistory(item: RequestHistoryItem) {
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, 10);
      localStorage.setItem("api-playground-history", JSON.stringify(updated));
      return updated;
    });
  }

  function handleEndpointChange(index: number) {
    const ep = ENDPOINTS[index];
    setSelectedEndpoint(ep);
    setParams(Object.fromEntries((ep.params ?? []).map((p) => [p.key, p.defaultValue])));
    setHeaders({});
    setResponse(null);
  }

  function buildUrl(): string {
    const query = new URLSearchParams(params).toString();
    return query ? `${selectedEndpoint.path}?${query}` : selectedEndpoint.path;
  }
  
  function getFullUrl(): string {
    const baseUrl = api.defaults.baseURL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const path = buildUrl();
    return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  async function handleSend() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsExecuting(true);
    setResponse(null);
    const start = performance.now();

    try {
      const res = await api.request({
        method: selectedEndpoint.method,
        url: selectedEndpoint.path,
        params: selectedEndpoint.method !== "POST" ? params : undefined,
        headers,
        signal: abortControllerRef.current.signal,
      });

      const latencyMs = parseFloat((performance.now() - start).toFixed(2));
      const sizeBytes = new TextEncoder().encode(JSON.stringify(res.data)).length;
      
      const parsedRes: ParsedResponse = {
        status: res.status,
        statusText: res.statusText,
        latencyMs,
        sizeBytes,
        headers: Object.fromEntries(Object.entries(res.headers).filter((e): e is [string, string] => typeof e[1] === "string")),
        data: res.data,
        isHtmlError: false,
        isOffline: false,
      };

      setResponse(parsedRes);
      saveHistory({
        id: crypto.randomUUID(),
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        timestamp: Date.now(),
        status: res.status,
        params,
        headers,
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        setIsExecuting(false);
        return;
      }
      
      const latencyMs = parseFloat((performance.now() - start).toFixed(2));
      
      if (err instanceof Error && err.message === "UNEXPECTED_HTML_RESPONSE") {
        setResponse({
          status: 200,
          statusText: "OK",
          latencyMs,
          sizeBytes: 0,
          headers: {},
          data: null,
          isHtmlError: true,
          isOffline: false,
        });
      } else if (axios.isAxiosError(err) && err.response) {
        const sizeBytes = err.response.data ? new TextEncoder().encode(JSON.stringify(err.response.data)).length : 0;
        setResponse({
          status: err.response.status,
          statusText: err.response.statusText,
          latencyMs,
          sizeBytes,
          headers: Object.fromEntries(Object.entries(err.response.headers).filter((e): e is [string, string] => typeof e[1] === "string")),
          data: err.response.data,
          isHtmlError: false,
          isOffline: false,
        });
        
        saveHistory({
          id: crypto.randomUUID(),
          method: selectedEndpoint.method,
          path: selectedEndpoint.path,
          timestamp: Date.now(),
          status: err.response.status,
          params,
          headers,
        });
      } else {
        // Network error / offline
        setResponse({
          status: 0,
          statusText: "Network Error",
          latencyMs,
          sizeBytes: 0,
          headers: {},
          data: null,
          isHtmlError: false,
          isOffline: true,
        });
      }
    } finally {
      setIsExecuting(false);
    }
  }

  function handleCopy(key: string, text: string) {
    void navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
  }

  function addParam() {
    if (newParamKey.trim()) {
      setParams(p => ({ ...p, [newParamKey.trim()]: newParamValue }));
      setNewParamKey("");
      setNewParamValue("");
    }
  }

  function addHeader() {
    if (newHeaderKey.trim()) {
      setHeaders(h => ({ ...h, [newHeaderKey.trim()]: newHeaderValue }));
      setNewHeaderKey("");
      setNewHeaderValue("");
    }
  }

  function loadHistoryItem(item: RequestHistoryItem) {
    const ep = ENDPOINTS.find(e => e.method === item.method && e.path === item.path) || ENDPOINTS[0];
    setSelectedEndpoint(ep);
    setParams(item.params);
    setHeaders(item.headers);
    setResponse(null);
    setShowHistory(false);
  }

  const statusVariant =
    response?.status && response.status < 400
      ? "allowed"
      : response?.status && response.status < 500
        ? "warning"
        : response
          ? "blocked"
          : "info";

  // Memoized syntax highlighted JSON
  const formattedJson = useMemo(() => {
    if (!response || response.isHtmlError || response.isOffline || !response.data) return null;
    try {
      const jsonStr = JSON.stringify(response.data, null, 2);
      // Basic syntax highlighting replacement
      return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = "text-blue-400"; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-purple-400"; // key
          } else {
            cls = "text-green-400"; // string
          }
        } else if (/true|false/.test(match)) {
          cls = "text-orange-400"; // boolean
        } else if (/null/.test(match)) {
          cls = "text-gray-400"; // null
        }
        return `<span class="${cls}">${match}</span>`;
      });
    } catch {
      return JSON.stringify(response.data, null, 2);
    }
  }, [response]);

  return (
    <AnimatedPage>
      <PageHeader
        title="API Playground"
        description="A lightweight Postman integrated into your dashboard"
        actions={
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <History className="h-3.5 w-3.5" />
            {showHistory ? "Hide History" : "History"}
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ── Left Sidebar: History ── */}
        {showHistory && (
          <div className="w-full lg:w-64 flex-shrink-0 animate-in slide-in-from-left-4 duration-300">
            <GlassCard className="h-full max-h-[800px] flex flex-col p-4">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <History className="h-4 w-4" /> Recent Requests
                </h3>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No history yet
                  </div>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="w-full flex flex-col text-left p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-[10px] font-bold uppercase", METHOD_COLORS[item.method])}>{item.method}</span>
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded",
                          item.status < 400 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                        )}>{item.status}</span>
                      </div>
                      <span className="text-xs text-foreground truncate block">{item.path}</span>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
          
          {/* ── Center: Request Builder ── */}
          <div className="flex flex-col gap-6">
            <GlassCard>
              <h3 className="mb-5 text-sm font-medium text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" /> Request Builder
              </h3>

              {/* Endpoint selector */}
              <div className="mb-4 flex gap-3 relative">
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 text-sm text-foreground hover:bg-secondary/50 focus:border-primary/40 focus:outline-none transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <span className={cn("font-bold text-[11px] px-1.5 py-0.5 rounded shrink-0", METHOD_COLORS[selectedEndpoint.method].replace("text-", "bg-").replace("-400", "-500/20") + " " + METHOD_COLORS[selectedEndpoint.method])}>{selectedEndpoint.method}</span>
                      <span className="truncate">{selectedEndpoint.path} <span className="text-muted-foreground ml-1">— {selectedEndpoint.label}</span></span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                      <div className="absolute top-full left-0 mt-2 w-full z-50 rounded-lg border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col p-1">
                        {ENDPOINTS.map((ep, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              handleEndpointChange(i);
                              setIsDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center px-2 py-2 text-sm text-left transition-colors rounded-md hover:bg-secondary/80",
                              selectedEndpoint === ep ? "bg-secondary/50" : ""
                            )}
                          >
                            <span className={cn("font-bold text-[11px] px-1.5 py-0.5 rounded mr-3 shrink-0 w-12 text-center", METHOD_COLORS[ep.method].replace("text-", "bg-").replace("-400", "-500/20") + " " + METHOD_COLORS[ep.method])}>{ep.method}</span>
                            <span className="text-foreground truncate">{ep.path} <span className="text-muted-foreground ml-1">— {ep.label}</span></span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => { setParams({}); setHeaders({}); }}
                  className="h-10 px-4 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  Clear
                </button>
              </div>

              {/* URL preview */}
              <div className="mb-6">
                <label className="mb-1.5 block text-xs font-medium text-foreground">URL</label>
                <div className="flex items-center gap-2 rounded-lg bg-background p-2 border border-border relative overflow-hidden group">
                  <span className={cn("px-2 text-xs font-bold shrink-0", METHOD_COLORS[selectedEndpoint.method])}>
                    {selectedEndpoint.method}
                  </span>
                  <div className="h-4 w-px bg-border shrink-0" />
                  <span className="truncate text-xs font-mono text-muted-foreground flex-1 select-all py-1">
                    {getFullUrl()}
                  </span>
                  <button
                    onClick={() => handleCopy("url", getFullUrl())}
                    className="absolute right-1 top-1 p-1.5 bg-background rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
                    title="Copy Full URL"
                  >
                    {copiedStates["url"] ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Parameters */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-foreground mb-3">Query Parameters</h4>
                <div className="space-y-2">
                  {Object.entries(params).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        className="h-8 w-1/3 rounded-md border border-border bg-secondary/20 px-2 text-xs text-muted-foreground cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setParams(p => ({ ...p, [key]: e.target.value }))}
                        className="h-8 flex-1 rounded-md border border-border bg-secondary/30 px-2 text-xs text-foreground focus:border-primary/40 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const newParams = { ...params };
                          delete newParams[key];
                          setParams(newParams);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="New Key"
                      value={newParamKey}
                      onChange={(e) => setNewParamKey(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addParam()}
                      className="h-8 w-1/3 rounded-md border border-border border-dashed bg-transparent px-2 text-xs text-foreground focus:border-primary/40 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newParamValue}
                      onChange={(e) => setNewParamValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addParam()}
                      className="h-8 flex-1 rounded-md border border-border border-dashed bg-transparent px-2 text-xs text-foreground focus:border-primary/40 focus:outline-none"
                    />
                    <button onClick={addParam} className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors text-xs font-medium">
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Headers */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-foreground mb-3">Headers</h4>
                <div className="space-y-2">
                  {Object.entries(headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        className="h-8 w-1/3 rounded-md border border-border bg-secondary/20 px-2 text-xs text-muted-foreground cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setHeaders(h => ({ ...h, [key]: e.target.value }))}
                        className="h-8 flex-1 rounded-md border border-border bg-secondary/30 px-2 text-xs text-foreground focus:border-primary/40 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const newHeaders = { ...headers };
                          delete newHeaders[key];
                          setHeaders(newHeaders);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Header Name"
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHeader()}
                      className="h-8 w-1/3 rounded-md border border-border border-dashed bg-transparent px-2 text-xs text-foreground focus:border-primary/40 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHeader()}
                      className="h-8 flex-1 rounded-md border border-border border-dashed bg-transparent px-2 text-xs text-foreground focus:border-primary/40 focus:outline-none"
                    />
                    <button onClick={addHeader} className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors text-xs font-medium">
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-auto border-t border-border pt-4">
                <button
                  onClick={handleSend}
                  disabled={isExecuting}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </div>

          {/* ── Right: Response Viewer ── */}
          <div className="flex flex-col h-full min-h-[500px]">
            <GlassCard className="flex h-full flex-col p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileCode className="h-4 w-4" /> Response Viewer
                </h3>
                
                {response && !response.isOffline && !response.isHtmlError && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <StatusBadge variant={statusVariant} label={`${response.status} ${response.statusText}`} />
                    <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">{response.latencyMs} ms</span>
                    <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">{(response.sizeBytes / 1024).toFixed(2)} KB</span>
                  </div>
                )}
              </div>

              <div className="flex-1 relative bg-background/50 overflow-hidden">
                {!response ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Send className="h-8 w-8 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Enter details and send a request</p>
                    <p className="text-xs opacity-70 mt-1">Response will appear here</p>
                  </div>
                ) : response.isOffline ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Backend Offline</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Unable to connect to Spring Boot. Please verify that the backend is running, the URL in Settings is correct, and Docker containers are healthy.
                    </p>
                    <button onClick={handleSend} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      <RefreshCcw className="h-4 w-4" /> Retry Connection
                    </button>
                  </div>
                ) : response.isHtmlError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Unexpected HTML Response</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      The request returned an HTML document instead of a JSON API response. This usually means the request was sent to the frontend application instead of the backend API.
                    </p>
                    <div className="text-xs text-left bg-secondary p-4 rounded-lg border border-border space-y-2 mb-6 w-full max-w-sm">
                      <p className="font-medium text-foreground">Suggestions:</p>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        <li>Verify Backend URL in Settings</li>
                        <li>Check Axios Base URL Configuration</li>
                        <li>Ensure Spring Boot is running on port 8080</li>
                      </ul>
                    </div>
                    <button onClick={handleSend} className="flex items-center gap-2 bg-secondary text-foreground border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                      Retry Request
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* Headers Tab */}
                    {Object.keys(response.headers).length > 0 && (
                      <div className="p-4 border-b border-border bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headers</span>
                          <button onClick={() => handleCopy("headers", JSON.stringify(response.headers, null, 2))} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
                            {copiedStates["headers"] ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />} Copy
                          </button>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                          {Object.entries(response.headers).map(([k, v]) => (
                            <div key={k} className="contents">
                              <span className="font-mono text-muted-foreground">{k}:</span>
                              <span className="font-mono text-foreground truncate" title={v}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Body */}
                    <div className="flex-1 relative">
                      <div className="absolute right-4 top-4 z-10">
                        <button
                          onClick={() => handleCopy("body", JSON.stringify(response.data, null, 2))}
                          className="flex items-center gap-2 rounded-md bg-secondary/80 backdrop-blur border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary shadow-sm"
                        >
                          {copiedStates["body"] ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedStates["body"] ? "Copied!" : "Copy JSON"}
                        </button>
                      </div>
                      <pre className="h-full w-full overflow-auto p-4 text-sm font-mono leading-relaxed bg-[#0d1117]">
                        <code dangerouslySetInnerHTML={{ __html: formattedJson || "" }} />
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
