import type {
  BucketEntry,
  ClientType,
  MetricsSummary,
  RateLimitHistoryEntry,
  RateLimitResponse,
  RecentActivity,
  TimeSeriesPoint,
  TopClient,
} from "@/types";

// ── Helpers ──

let idCounter = 0;
function uid(): string {
  idCounter += 1;
  return `mock-${Date.now()}-${idCounter}`;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CLIENT_TYPES: ClientType[] = ["API_KEY", "JWT", "IP", "USER"];

const SAMPLE_CLIENTS = [
  { type: "API_KEY" as ClientType, value: "sk-proj-abc123" },
  { type: "API_KEY" as ClientType, value: "sk-prod-xyz789" },
  { type: "JWT" as ClientType, value: "user-service-token" },
  { type: "JWT" as ClientType, value: "auth-gateway-token" },
  { type: "IP" as ClientType, value: "192.168.1.42" },
  { type: "IP" as ClientType, value: "10.0.0.15" },
  { type: "IP" as ClientType, value: "172.16.0.100" },
  { type: "USER" as ClientType, value: "admin@ratelimiter.dev" },
  { type: "USER" as ClientType, value: "dev@example.com" },
  { type: "USER" as ClientType, value: "bot-crawler-01" },
];

// ── Mock Data Generators ──

export function generateMockBuckets(): BucketEntry[] {
  return SAMPLE_CLIENTS.map((c) => ({
    client: c,
    capacity: randomBetween(50, 200),
    refillTokensPerSecond: randomBetween(5, 20),
    availableTokens: randomBetween(0, 150),
    lastRefillTimestamp: Date.now() - randomBetween(1000, 60000),
  }));
}

export function generateMockMetrics(): MetricsSummary {
  return {
    allowedRequests: randomBetween(12000, 35000),
    blockedRequests: randomBetween(800, 5000),
    activeBuckets: SAMPLE_CLIENTS.length,
    redisStatus: "connected",
    redisHits: randomBetween(20000, 80000),
    averageLatencyMs: parseFloat((Math.random() * 4 + 0.5).toFixed(2)),
  };
}

export function generateTimeSeriesData(hours: number = 24): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const now = Date.now();
  for (let i = hours; i >= 0; i--) {
    const ts = new Date(now - i * 3600000);
    points.push({
      timestamp: ts.toISOString(),
      allowed: randomBetween(80, 500),
      blocked: randomBetween(5, 80),
    });
  }
  return points;
}

export function generateTopClients(): TopClient[] {
  return SAMPLE_CLIENTS.slice(0, 6).map((c) => {
    const allowed = randomBetween(500, 5000);
    const blocked = randomBetween(20, 800);
    return {
      clientId: c.value,
      clientType: c.type,
      totalRequests: allowed + blocked,
      allowedRequests: allowed,
      blockedRequests: blocked,
    };
  });
}

export function generateRecentActivity(count: number = 10): RecentActivity[] {
  const activities: RecentActivity[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const client = SAMPLE_CLIENTS[randomBetween(0, SAMPLE_CLIENTS.length - 1)];
    activities.push({
      id: uid(),
      clientId: client.value,
      clientType: client.type,
      allowed: Math.random() > 0.25,
      tokensRemaining: randomBetween(0, 100),
      timestamp: new Date(now - i * randomBetween(2000, 15000)).toISOString(),
      latencyMs: parseFloat((Math.random() * 5 + 0.3).toFixed(2)),
    });
  }
  return activities;
}

export function generateMockRateLimitResponse(
  clientType: ClientType,
  clientId: string
): RateLimitResponse {
  const allowed = Math.random() > 0.3;
  const capacity = 100;
  const remaining = allowed ? randomBetween(10, 95) : 0;
  return {
    allowed,
    tokensRemaining: remaining,
    clientType,
    clientId,
    capacity,
    refillRate: 10,
    latencyMs: parseFloat((Math.random() * 4 + 0.5).toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}

export function generateMockHistoryEntry(
  clientType: ClientType,
  clientId: string
): RateLimitHistoryEntry {
  return {
    id: uid(),
    ...generateMockRateLimitResponse(clientType, clientId),
  };
}

export { CLIENT_TYPES, SAMPLE_CLIENTS };
