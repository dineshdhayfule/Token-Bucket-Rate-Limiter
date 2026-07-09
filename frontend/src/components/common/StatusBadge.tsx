import { cn } from "@/utils/utils";

type StatusVariant = "allowed" | "blocked" | "warning" | "info" | "connected" | "disconnected";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const variantStyles: Record<StatusVariant, { dot: string; bg: string; text: string }> = {
  allowed: {
    dot: "bg-success",
    bg: "bg-success/10",
    text: "text-success",
  },
  connected: {
    dot: "bg-success",
    bg: "bg-success/10",
    text: "text-success",
  },
  blocked: {
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
  disconnected: {
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
  warning: {
    dot: "bg-warning",
    bg: "bg-warning/10",
    text: "text-warning",
  },
  info: {
    dot: "bg-primary",
    bg: "bg-primary/10",
    text: "text-primary",
  },
};

const defaultLabels: Record<StatusVariant, string> = {
  allowed: "Allowed",
  blocked: "Blocked",
  warning: "Warning",
  info: "Info",
  connected: "Connected",
  disconnected: "Disconnected",
};

export default function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const styles = variantStyles[variant];
  const displayLabel = label ?? defaultLabels[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {displayLabel}
    </span>
  );
}
