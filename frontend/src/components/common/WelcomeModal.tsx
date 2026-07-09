import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user";

export default function WelcomeModal() {
  const { displayName, setDisplayName, isInitialized } = useUser();
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only open if initialized and we still don't have a display name
    if (isInitialized && !displayName) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isInitialized, displayName]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0 && trimmed.length <= 30) {
      setDisplayName(trimmed);
      setIsOpen(false);
    }
  }

  const isValid = name.trim().length > 0 && name.trim().length <= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-border bg-card p-6 shadow-2xl overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-accent/10 blur-[60px]" />

        <div className="relative z-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome 👋
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome to the Token Bucket Rate Limiter Dashboard.
              Let's personalize your experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="off"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
