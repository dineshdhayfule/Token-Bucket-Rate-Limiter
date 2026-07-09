/** Mirrors backend com.dinesh.ratelimiter.model.ClientType */
export const ClientType = {
  API_KEY: "API_KEY",
  JWT: "JWT",
  IP: "IP",
  USER: "USER",
} as const;

export type ClientType = (typeof ClientType)[keyof typeof ClientType];

/** Mirrors backend com.dinesh.ratelimiter.model.ClientIdentifier */
export interface ClientIdentifier {
  type: ClientType;
  value: string;
}

/** Mirrors backend com.dinesh.ratelimiter.model.Bucket */
export interface Bucket {
  capacity: number;
  refillTokensPerSecond: number;
  availableTokens: number;
  lastRefillTimestamp: number;
}

/** Mirrors backend com.dinesh.ratelimiter.dto.RateLimitResult */
export interface RateLimitResult {
  allowed: boolean;
  tokensRemaining: number;
}

/** Flattened bucket entry for table display */
export interface BucketEntry {
  client: ClientIdentifier;
  capacity: number;
  refillTokensPerSecond: number;
  availableTokens: number;
  lastRefillTimestamp: number;
}

/** Extended rate limit response with frontend-added fields */
export interface RateLimitResponse extends RateLimitResult {
  clientType: ClientType;
  clientId: string;
  capacity: number;
  refillRate: number;
  latencyMs: number;
  timestamp: string;
}

/** Single history entry for the rate limit tester */
export interface RateLimitHistoryEntry extends RateLimitResponse {
  id: string;
}

/** Dashboard metric summary */
export interface MetricsSummary {
  allowedRequests: number;
  blockedRequests: number;
  activeBuckets: number;
  redisStatus: "connected" | "disconnected";
  redisHits: number;
  averageLatencyMs: number;
}

/** Time-series data point for charts */
export interface TimeSeriesPoint {
  timestamp: string;
  allowed: number;
  blocked: number;
}

/** Top client entry for charts */
export interface TopClient {
  clientId: string;
  clientType: ClientType;
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
}

/** Recent activity entry for dashboard */
export interface RecentActivity {
  id: string;
  clientId: string;
  clientType: ClientType;
  allowed: boolean;
  tokensRemaining: number;
  timestamp: string;
  latencyMs: number;
}

/** API Playground request */
export interface ApiPlaygroundRequest {
  method: "GET" | "POST" | "DELETE";
  endpoint: string;
  params: Record<string, string>;
  headers: Record<string, string>;
  body: string;
}

/** API Playground response */
export interface ApiPlaygroundResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  latencyMs: number;
}

/** Login credentials */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

/** Authenticated user */
export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

/** App settings stored in localStorage */
export interface AppSettings {
  backendUrl: string;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: "dark" | "light" | "system";
}
