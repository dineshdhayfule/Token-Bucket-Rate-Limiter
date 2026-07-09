import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/utils/utils";

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

export default function JsonViewer({ data, className }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const formatted = JSON.stringify(data, null, 2);

  function handleCopy() {
    void navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Copy JSON"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <pre className="overflow-auto rounded-lg bg-background p-4 text-xs leading-relaxed text-foreground">
        <code>{formatted}</code>
      </pre>
    </div>
  );
}
