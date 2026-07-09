import { useQuery } from "@tanstack/react-query";
import {
  getMetricsSummary,
  getRequestsOverTime,
  getTopClients,
  getRecentActivity,
} from "@/services/metrics.service";

export function useMetricsSummary() {
  return useQuery({
    queryKey: ["metrics", "summary"],
    queryFn: getMetricsSummary,
    refetchInterval: 15000,
  });
}

export function useRequestsOverTime(hours: number = 24) {
  return useQuery({
    queryKey: ["metrics", "timeseries", hours],
    queryFn: () => getRequestsOverTime(hours),
    refetchInterval: 30000,
  });
}

export function useTopClients() {
  return useQuery({
    queryKey: ["metrics", "top-clients"],
    queryFn: getTopClients,
    refetchInterval: 30000,
  });
}

export function useRecentActivity(count: number = 10) {
  return useQuery({
    queryKey: ["metrics", "recent-activity", count],
    queryFn: () => getRecentActivity(count),
    refetchInterval: 10000,
  });
}
