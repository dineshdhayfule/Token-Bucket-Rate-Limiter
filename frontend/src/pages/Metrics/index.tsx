import { useMemo } from "react";
import {
  ShieldCheck,
  ShieldX,
  Database,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import MetricCard from "@/components/common/MetricCard";
import ChartCard from "@/components/common/ChartCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import {
  useMetricsSummary,
  useRequestsOverTime,
  useTopClients,
} from "@/hooks/use-metrics";

const TOOLTIP_STYLE = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#f8fafc",
};

export default function Metrics() {
  const { data: metrics, isLoading: metricsLoading } = useMetricsSummary();
  const { data: timeSeries, isLoading: tsLoading } = useRequestsOverTime();
  const { data: topClients, isLoading: tcLoading } = useTopClients();

  const rpmData = useMemo(
    () =>
      timeSeries?.map((p) => ({
        time: new Date(p.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        requests: p.allowed + p.blocked,
      })) ?? [],
    [timeSeries]
  );

  const blockedPieData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: "Allowed", value: metrics.allowedRequests, color: "#22c55e" },
      { name: "Blocked", value: metrics.blockedRequests, color: "#ef4444" },
    ];
  }, [metrics]);

  const clientData = useMemo(
    () =>
      topClients?.map((c) => ({
        name: c.clientId.length > 14 ? c.clientId.slice(0, 14) + "…" : c.clientId,
        total: c.totalRequests,
      })) ?? [],
    [topClients]
  );

  const blockedPct = metrics
    ? (
        (metrics.blockedRequests /
          (metrics.allowedRequests + metrics.blockedRequests)) *
        100
      ).toFixed(1)
    : "0";

  return (
    <AnimatedPage>
      <PageHeader
        title="Metrics"
        description="Monitoring and observability for rate limiting"
      />

      {/* Metric Cards */}
      {metricsLoading ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Allowed"
            value={metrics?.allowedRequests ?? 0}
            icon={ShieldCheck}
            iconColor="text-success"
          />
          <MetricCard
            label="Blocked"
            value={metrics?.blockedRequests ?? 0}
            icon={ShieldX}
            iconColor="text-destructive"
          />
          <MetricCard
            label="Redis Hits"
            value={metrics?.redisHits ?? 0}
            icon={Database}
            iconColor="text-primary"
          />
          <MetricCard
            label="Avg Latency"
            value={`${metrics?.averageLatencyMs ?? 0}ms`}
            icon={Clock}
            iconColor="text-warning"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tsLoading ? (
          <>
            <LoadingSkeleton variant="chart" />
            <LoadingSkeleton variant="chart" />
          </>
        ) : (
          <>
            {/* Requests per minute */}
            <ChartCard
              title="Requests per Hour"
              description="Total throughput over the last 24 hours"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rpmData}>
                    <defs>
                      <linearGradient id="gradReqs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip cursor={{ stroke: "transparent", fill: "transparent" }} contentStyle={TOOLTIP_STYLE} />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#3b82f6"
                      fill="url(#gradReqs)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Blocked Percentage Donut */}
            <ChartCard
              title="Blocked Percentage"
              description={`${blockedPct}% of requests blocked`}
            >
              <div className="flex h-64 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={blockedPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {blockedPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={{ stroke: "transparent", fill: "transparent" }} contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </>
        )}

        {/* Top Clients */}
        {tcLoading ? (
          <LoadingSkeleton variant="chart" className="lg:col-span-2" />
        ) : (
          <ChartCard
            title="Top Clients by Volume"
            description="Most active clients across all request types"
            className="lg:col-span-2"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip cursor={{ fill: "transparent", stroke: "transparent" }} contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
      </div>
    </AnimatedPage>
  );
}
