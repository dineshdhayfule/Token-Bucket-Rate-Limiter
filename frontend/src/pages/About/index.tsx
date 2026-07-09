import { ExternalLink } from "lucide-react";
import AnimatedPage from "@/components/common/AnimatedPage";
import PageHeader from "@/components/common/PageHeader";
import GlassCard from "@/components/common/GlassCard";

const TECH_STACK = {
  backend: [
    { name: "Java 21", desc: "Modern language features" },
    { name: "Spring Boot 3", desc: "Production-ready framework" },
    { name: "Redis", desc: "In-memory data store" },
    { name: "Docker", desc: "Containerized deployment" },
    { name: "Micrometer", desc: "Application metrics" },
    { name: "Swagger / OpenAPI", desc: "API documentation" },
  ],
  frontend: [
    { name: "React 19", desc: "UI library" },
    { name: "TypeScript", desc: "Type-safe development" },
    { name: "Vite", desc: "Next-gen build tool" },
    { name: "Tailwind CSS", desc: "Utility-first CSS" },
    { name: "TanStack Query", desc: "Data fetching" },
    { name: "Recharts", desc: "Data visualization" },
  ],
};

const ARCHITECTURE_STEPS = [
  { label: "Client Request", desc: "API Key / JWT / IP / User", color: "bg-primary" },
  { label: "Spring Boot", desc: "Controller layer", color: "bg-success" },
  { label: "Rate Limiter", desc: "Token Bucket Algorithm", color: "bg-accent" },
  { label: "Redis", desc: "Bucket storage & state", color: "bg-destructive" },
  { label: "Response", desc: "Allowed or Blocked", color: "bg-warning" },
];

export default function About() {
  return (
    <AnimatedPage>
      <PageHeader
        title="About"
        description="Token Bucket Rate Limiter — Architecture, tech stack, and links"
      />

      <div className="space-y-6">
        {/* Overview */}
        <GlassCard>
          <h3 className="mb-3 text-sm font-medium text-foreground">Project Overview</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A production-grade rate limiting solution using the{" "}
            <span className="font-medium text-foreground">Token Bucket algorithm</span>.
            Each client gets a bucket with a fixed capacity that refills at a constant rate.
            When a request arrives, a token is consumed. If the bucket is empty, the request
            is blocked until tokens refill. All state is persisted in Redis for horizontal
            scalability.
          </p>
        </GlassCard>

        {/* Architecture Flow */}
        <GlassCard>
          <h3 className="mb-5 text-sm font-medium text-foreground">Architecture</h3>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
            {ARCHITECTURE_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-14 w-36 items-center justify-center rounded-lg ${step.color}/15`}
                  >
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                </div>
                {i < ARCHITECTURE_STEPS.length - 1 && (
                  <div className="hidden h-px w-8 bg-border sm:block" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tech Stack */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="mb-4 text-sm font-medium text-foreground">Backend Stack</h3>
            <div className="space-y-3">
              {TECH_STACK.backend.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center justify-between rounded-lg bg-secondary/20 p-3"
                >
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                  <span className="text-xs text-muted-foreground">{tech.desc}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="mb-4 text-sm font-medium text-foreground">Frontend Stack</h3>
            <div className="space-y-3">
              {TECH_STACK.frontend.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center justify-between rounded-lg bg-secondary/20 p-3"
                >
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                  <span className="text-xs text-muted-foreground">{tech.desc}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Links */}
        <GlassCard>
          <h3 className="mb-4 text-sm font-medium text-foreground">Links</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "GitHub",
                href: "https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter",
                desc: "Source code",
              },
              {
                label: "Swagger UI",
                href: "http://localhost:8080/swagger-ui.html",
                desc: "API documentation",
              },
              {
                label: "Author",
                href: "https://github.com/dineshdhayfule",
                desc: "Dinesh Dhayfule",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/20 hover:bg-card"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
