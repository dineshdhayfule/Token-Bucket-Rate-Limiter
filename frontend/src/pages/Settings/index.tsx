import { Moon, Sun, Monitor, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import GlassCard from "@/components/common/GlassCard";
import { useSettings } from "@/hooks/use-settings";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const THEME_OPTIONS = [
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "system" as const, label: "System", icon: Monitor },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { displayName, setDisplayName } = useUser();

  const [localName, setLocalName] = useState(displayName ?? "");

  useEffect(() => {
    setLocalName(displayName ?? "");
  }, [displayName]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalName(e.target.value);
  }

  function handleNameBlur() {
    const trimmed = localName.trim();
    if (trimmed && trimmed !== displayName) {
      setDisplayName(trimmed);
      toast.success("Display name updated");
    } else {
      setLocalName(displayName ?? "");
    }
  }

  function handleClearHistory() {
    // Clear all localStorage items except settings and displayName
    const keysToKeep = ["app-settings", "theme", "displayName"];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    toast.success("History cleared");
  }

  return (
    <AnimatedPage>
      <PageHeader
        title="Settings"
        description="Configure the dashboard preferences"
      />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <GlassCard>
          <h3 className="mb-1 text-sm font-medium text-foreground">Display Name</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Personalize how you are greeted in the sidebar
          </p>
          <input
            type="text"
            value={localName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            maxLength={30}
            placeholder="Enter your name"
            className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </GlassCard>

        {/* Theme */}
        <GlassCard>
          <h3 className="mb-4 text-sm font-medium text-foreground">Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  updateSetting("theme", opt.value);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-medium transition-colors ${
                  theme === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Backend URL */}
        <GlassCard>
          <h3 className="mb-1 text-sm font-medium text-foreground">Backend URL</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Leave empty to use the default proxy
          </p>
          <input
            type="url"
            value={settings.backendUrl}
            onChange={(e) => updateSetting("backendUrl", e.target.value)}
            placeholder="http://localhost:8080"
            className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </GlassCard>

        {/* Auto Refresh */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Auto Refresh</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Automatically refresh data at regular intervals
              </p>
            </div>
            <button
              onClick={() => updateSetting("autoRefresh", !settings.autoRefresh)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.autoRefresh ? "bg-primary" : "bg-secondary"
              }`}
              role="switch"
              aria-checked={settings.autoRefresh}
              aria-label="Toggle auto refresh"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.autoRefresh ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {settings.autoRefresh && (
            <div className="mt-4">
              <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground">
                <span>Refresh Interval</span>
                <span className="text-muted-foreground">{settings.refreshInterval}s</span>
              </label>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={settings.refreshInterval}
                onChange={(e) =>
                  updateSetting("refreshInterval", Number(e.target.value))
                }
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>5s</span>
                <span>120s</span>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Preferences */}
        <GlassCard>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Reset Preferences</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Restore all settings to default values
              </p>
            </div>
            <button
              onClick={() => {
                resetSettings();
                toast.success("Preferences reset to defaults");
              }}
              className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary"
            >
              Reset
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Clear History</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Remove cached data and request history
              </p>
            </div>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
        </GlassCard>

        {/* Version */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Version</h3>
            <span className="rounded bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground">
              v1.0.0
            </span>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
