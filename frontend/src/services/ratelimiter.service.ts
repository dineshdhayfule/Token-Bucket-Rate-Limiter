import { api } from "@/config/axios";
import { generateMockRateLimitResponse } from "@/services/mock-data";
import type { ClientType, RateLimitResponse, RateLimitResult } from "@/types";

/**
 * Check rate limit for a single client.
 * Falls back to mock data if the backend is unreachable.
 */
export async function checkRateLimit(
  type: ClientType,
  id: string
): Promise<RateLimitResponse> {
  const start = performance.now();

  try {
    const response = await api.get<RateLimitResult>("/api/check", {
      params: { type, id },
    });

    const latencyMs = parseFloat((performance.now() - start).toFixed(2));

    return {
      ...response.data,
      clientType: type,
      clientId: id,
      capacity: 100, // Not returned by backend — use default
      refillRate: 10,
      latencyMs,
      timestamp: new Date().toISOString(),
    };
  } catch {
    // Backend unavailable — return mock
    return generateMockRateLimitResponse(type, id);
  }
}

/**
 * Send N sequential rate limit requests to simulate load.
 * Calls the onProgress callback after each request completes.
 */
export async function sendBatchRequests(
  type: ClientType,
  id: string,
  count: number,
  onProgress?: (completed: number, result: RateLimitResponse) => void
): Promise<RateLimitResponse[]> {
  const results: RateLimitResponse[] = [];

  for (let i = 0; i < count; i++) {
    const result = await checkRateLimit(type, id);
    results.push(result);
    onProgress?.(i + 1, result);
  }

  return results;
}
