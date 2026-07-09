import { useMemo } from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  ShieldX,
  Database,
  Wifi,
  Clock,
  Zap,
  Terminal,
  ArrowRight,
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
} from "recharts";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import MetricCard from "@/components/common/MetricCard";
import ChartCard from "@/components/common/ChartCard";
import StatusBadge from "@/components/common/StatusBadge";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import {
  useMetricsSummary,
  useRequestsOverTime,
  useTopClients,
  useRecentActivity,
} from "@/hooks/use-metrics";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useMetricsSummary();
  const { data: timeSeries, isLoading: timeSeriesLoading } = useRequestsOverTime();
  const { data: topClients } = useTopClients();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  const chartData = useMemo(
    () =>
      timeSeries?.map((p) => ({
        time: new Date(p.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        allowed: p.allowed,
        blocked: p.blocked,
      })) ?? [],
    [timeSeries]
  );

  const clientChartData = useMemo(
    () =>
      topClients?.map((c) => ({
        name: c.clientId.length > 12 ? c.clientId.slice(0, 12) + "…" : c.clientId,
        allowed: c.allowedRequests,
        blocked: c.blockedRequests,
      })) ?? [],
    [topClients]
  );

  return (
    <AnimatedPage>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your rate limiting infrastructure"
      />

      {/* Metric Cards */}
      {metricsLoading ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            label="Allowed Requests"
            value={metrics?.allowedRequests ?? 0}
            icon={ShieldCheck}
            iconColor="text-success"
          />
          <MetricCard
            label="Blocked Requests"
            value={metrics?.blockedRequests ?? 0}
            icon={ShieldX}
            iconColor="text-destructive"
          />
          <MetricCard
            label="Active Buckets"
            value={metrics?.activeBuckets ?? 0}
            icon={Database}
            iconColor="text-primary"
          />
          <MetricCard
            label="Redis Status"
            value={metrics?.redisStatus === "connected" ? "Connected" : "Disconnected"}
            icon={Wifi}
            iconColor={
              metrics?.redisStatus === "connected"
                ? "text-success"
                : "text-destructive"
            }
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
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {timeSeriesLoading ? (
          <>
            <LoadingSkeleton variant="chart" />
            <LoadingSkeleton variant="chart" />
          </>
        ) : (
          <>
            <ChartCard
              title="Allowed vs Blocked"
              description="Request distribution over the last 24 hours"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradAllowed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradBlocked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
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
                    <Tooltip
                      cursor={{ stroke: "transparent", fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="allowed"
                      stroke="#22c55e"
                      fill="url(#gradAllowed)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="blocked"
                      stroke="#ef4444"
                      fill="url(#gradBlocked)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Top Clients"
              description="Requests by client identifier"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientChartData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent", stroke: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                    />
                    <Bar dataKey="allowed" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="blocked" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
          </div>
          {activityLoading ? (
            <div className="p-4">
              <LoadingSkeleton variant="table" rows={5} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Client
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tokens
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Latency
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentActivity?.map((activity) => (
                    <tr
                      key={activity.id}
                      className="transition-colors hover:bg-secondary/20"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-foreground">
                        {activity.clientId}
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {activity.clientType}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          variant={activity.allowed ? "allowed" : "blocked"}
                        />
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {activity.tokensRemaining}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {activity.latencyMs}ms
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            to: "/tester",
            icon: Zap,
            title: "Rate Limit Tester",
            desc: "Test rate limiting in real time",
          },
          {
            to: "/buckets",
            icon: Database,
            title: "View Buckets",
            desc: "Browse active token buckets",
          },
          {
            to: "/api-playground",
            icon: Terminal,
            title: "API Playground",
            desc: "Explore the backend API",
          },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </AnimatedPage>
  );
}
