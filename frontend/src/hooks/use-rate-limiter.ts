import { useMutation } from "@tanstack/react-query";
import {
  checkRateLimit,
  sendBatchRequests,
} from "@/services/ratelimiter.service";
import type { ClientType, RateLimitResponse } from "@/types";

interface CheckRateLimitVars {
  type: ClientType;
  id: string;
}

interface BatchRequestVars {
  type: ClientType;
  id: string;
  count: number;
  onProgress?: (completed: number, result: RateLimitResponse) => void;
}

export function useCheckRateLimit() {
  return useMutation({
    mutationFn: ({ type, id }: CheckRateLimitVars) =>
      checkRateLimit(type, id),
  });
}

export function useBatchRequests() {
  return useMutation({
    mutationFn: ({ type, id, count, onProgress }: BatchRequestVars) =>
      sendBatchRequests(type, id, count, onProgress),
  });
}
