import { cn } from "@/utils/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/80 p-6 backdrop-blur-sm",
        hover && "transition-all duration-200 hover:border-primary/20 hover:bg-card",
        className
      )}
    >
      {children}
    </div>
  );
}
