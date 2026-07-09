import {
  generateMockMetrics,
  generateTimeSeriesData,
  generateTopClients,
  generateRecentActivity,
} from "@/services/mock-data";
import type {
  MetricsSummary,
  TimeSeriesPoint,
  TopClient,
  RecentActivity,
} from "@/types";

/**
 * Fetch metrics summary.
 * In production this would hit the Spring Boot Actuator / Prometheus endpoints.
 */
export async function getMetricsSummary(): Promise<MetricsSummary> {
  // TODO: Connect to /actuator/metrics once backend exposes summary endpoint
  await new Promise((resolve) => setTimeout(resolve, 300));
  return generateMockMetrics();
}

/**
 * Fetch time-series request data for charts.
 */
export async function getRequestsOverTime(
  hours: number = 24
): Promise<TimeSeriesPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return generateTimeSeriesData(hours);
}

/**
 * Fetch top clients by request volume.
 */
export async function getTopClients(): Promise<TopClient[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return generateTopClients();
}

/**
 * Fetch recent rate-limit activity for the dashboard.
 */
export async function getRecentActivity(
  count: number = 10
): Promise<RecentActivity[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return generateRecentActivity(count);
}
