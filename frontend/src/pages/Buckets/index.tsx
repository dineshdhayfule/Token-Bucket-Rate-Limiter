import { useState, useMemo } from "react";
import { Database, RotateCcw, Trash2, Eye, X, Activity, Server, Hash, Zap } from "lucide-react";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchInput from "@/components/common/SearchInput";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import MetricCard from "@/components/common/MetricCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useBuckets, useDeleteBucket, useResetBuckets } from "@/hooks/use-buckets";
import type { BucketEntry } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/utils/utils";

export default function Buckets() {
  const { data: buckets, isLoading } = useBuckets();
  const deleteMutation = useDeleteBucket();
  const resetMutation = useResetBuckets();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<BucketEntry | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [viewTarget, setViewTarget] = useState<BucketEntry | null>(null);

  const filtered = useMemo(() => {
    return (buckets ?? []).filter((b) => {
      const matchesSearch =
        b.client.value.toLowerCase().includes(search.toLowerCase()) ||
        b.client.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || b.client.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [buckets, search, typeFilter]);

  // Summary Metrics
  const summary = useMemo(() => {
    if (!buckets || buckets.length === 0) {
      return { active: 0, avgTokens: 0, avgCapacity: 0, avgRefill: 0 };
    }
    const totalTokens = buckets.reduce((acc, b) => acc + b.availableTokens, 0);
    const totalCapacity = buckets.reduce((acc, b) => acc + b.capacity, 0);
    const totalRefill = buckets.reduce((acc, b) => acc + b.refillTokensPerSecond, 0);
    
    return {
      active: buckets.length,
      avgTokens: Math.round(totalTokens / buckets.length),
      avgCapacity: Math.round(totalCapacity / buckets.length),
      avgRefill: Math.round((totalRefill / buckets.length) * 10) / 10,
    };
  }, [buckets]);

  const columns: Column<BucketEntry>[] = [
    {
      key: "client",
      header: "Client",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-medium text-foreground">{row.client.value}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {row.client.type}
        </span>
      ),
    },
    {
      key: "tokens",
      header: "Remaining Tokens",
      sortable: true,
      render: (row) => {
        const pct = row.capacity > 0 ? (row.availableTokens / row.capacity) * 100 : 0;
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{row.availableTokens}</span>
              <span className="text-muted-foreground">/ {row.capacity}</span>
            </div>
            <div className="h-1.5 w-full max-w-[120px] rounded-full bg-secondary/50">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  pct > 66 ? "bg-success" : pct > 33 ? "bg-warning" : "bg-destructive"
                )}
                style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "capacity",
      header: "Capacity",
      sortable: true,
      render: (row) => <span className="text-xs text-muted-foreground">{row.capacity}</span>,
    },
    {
      key: "refillRate",
      header: "Refill Rate",
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.refillTokensPerSecond}/s</span>
      ),
    },
    {
      key: "updated",
      header: "Last Refill",
      sortable: true,
      render: (row) => {
        const date = row.lastRefillTimestamp ? new Date(row.lastRefillTimestamp) : null;
        const isValidDate = date && !isNaN(date.getTime());
        
        return (
          <span className="text-xs text-muted-foreground">
            {isValidDate ? formatDistanceToNow(date, { addSuffix: true }) : "Unknown"}
          </span>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge 
          variant={row.availableTokens > 0 ? "allowed" : "blocked"} 
          label={row.availableTokens > 0 ? "Active" : "Exhausted"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => setViewTarget(row)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={`View bucket for ${row.client.value}`}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete bucket for ${row.client.value}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Buckets"
        description="Manage and inspect all active token buckets"
        actions={
          <button
            onClick={() => setShowResetDialog(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All
          </button>
        }
      />

      {/* Summary Cards */}
      {isLoading ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Active Buckets"
            value={summary.active}
            icon={Server}
            iconColor="text-primary"
          />
          <MetricCard
            label="Avg Tokens Remaining"
            value={summary.avgTokens}
            icon={Activity}
            iconColor="text-success"
          />
          <MetricCard
            label="Avg Capacity"
            value={summary.avgCapacity}
            icon={Hash}
            iconColor="text-foreground"
          />
          <MetricCard
            label="Avg Refill Rate"
            value={`${summary.avgRefill}/s`}
            icon={Zap}
            iconColor="text-warning"
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search clients..."
          className="w-full sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-secondary/30 px-3 text-sm text-foreground focus:border-primary/40 focus:outline-none"
          aria-label="Filter by client type"
        >
          <option value="all">All Types</option>
          <option value="API_KEY">API Key</option>
          <option value="JWT">JWT</option>
          <option value="IP">IP</option>
          <option value="USER">User</option>
        </select>
        {buckets && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:ml-auto">
            <Database className="h-3.5 w-3.5" />
            {filtered.length} matching bucket{filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyTitle="No buckets found"
        emptyDescription="Rate limit some clients to see buckets here."
        getRowKey={(row) => `${row.client.type}:${row.client.value}`}
      />

      {/* View Bucket Drawer/Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setViewTarget(null)}
            aria-hidden
          />
          <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300 sm:w-[400px]">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Bucket Details</h2>
              <button
                onClick={() => setViewTarget(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Client</p>
                  <p className="mt-1 font-mono text-sm font-medium text-foreground break-all">
                    {viewTarget.client.value}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Client Type</p>
                  <div className="mt-1">
                    <span className="rounded bg-secondary/60 px-2 py-1 text-xs font-medium text-muted-foreground">
                      {viewTarget.client.type}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Token Status</p>
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-foreground">{viewTarget.availableTokens}</span>
                      <span className="text-sm font-medium text-muted-foreground mb-1">/ {viewTarget.capacity} max</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          (viewTarget.availableTokens / viewTarget.capacity) > 0.5 ? "bg-success" : 
                          (viewTarget.availableTokens / viewTarget.capacity) > 0.2 ? "bg-warning" : "bg-destructive"
                        )}
                        style={{ width: `${Math.max(0, Math.min(100, (viewTarget.availableTokens / viewTarget.capacity) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Refill Rate</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{viewTarget.refillTokensPerSecond}/s</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Bucket Status</p>
                    <div className="mt-2">
                      <StatusBadge 
                        variant={viewTarget.availableTokens > 0 ? "allowed" : "blocked"} 
                        label={viewTarget.availableTokens > 0 ? "Active" : "Exhausted"}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Refill Time</p>
                  <p className="mt-1 text-sm text-foreground">
                    {new Date(viewTarget.lastRefillTimestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(viewTarget.lastRefillTimestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-4 bg-secondary/20 flex justify-end gap-3">
              <button
                onClick={() => setViewTarget(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDeleteTarget(viewTarget);
                  setViewTarget(null);
                }}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Bucket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteMutation.mutateAsync({
            type: deleteTarget.client.type,
            id: deleteTarget.client.value,
          });
          toast.success("Bucket deleted");
        }}
        title="Delete Bucket"
        description={`This will remove the bucket for "${deleteTarget?.client.value}". The bucket will be recreated on the next request.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Reset dialog */}
      <ConfirmDialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={async () => {
          await resetMutation.mutateAsync();
          toast.success("All buckets reset");
        }}
        title="Reset All Buckets"
        description="This will reset all token buckets. New buckets will be created on the next request for each client."
        confirmLabel="Reset All"
        variant="danger"
      />
    </AnimatedPage>
  );
}
