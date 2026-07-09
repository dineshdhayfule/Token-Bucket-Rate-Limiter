import { lazy, Suspense } from "react";
import { createBrowserRouter, useRouteError } from "react-router";
import MainLayout from "@/layouts/MainLayout";

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Playground = lazy(() => import("@/pages/Playground"));
const Buckets = lazy(() => import("@/pages/Buckets"));
const Metrics = lazy(() => import("@/pages/Metrics"));
const ApiExplorer = lazy(() => import("@/pages/ApiExplorer"));
const Settings = lazy(() => import("@/pages/Settings"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function ErrorDisplay() {
  const error = useRouteError() as Error;
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold text-destructive mb-4">Application Error</h1>
      <pre className="bg-secondary p-4 rounded-lg text-left text-sm text-foreground overflow-auto max-w-full">
        {error?.message || String(error)}
        {"\n"}
        {error?.stack}
      </pre>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorDisplay />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: "tester",
        element: (
          <LazyWrapper>
            <Playground />
          </LazyWrapper>
        ),
      },
      {
        path: "buckets",
        element: (
          <LazyWrapper>
            <Buckets />
          </LazyWrapper>
        ),
      },
      {
        path: "metrics",
        element: (
          <LazyWrapper>
            <Metrics />
          </LazyWrapper>
        ),
      },
      {
        path: "api-playground",
        element: (
          <LazyWrapper>
            <ApiExplorer />
          </LazyWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <LazyWrapper>
            <Settings />
          </LazyWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <LazyWrapper>
            <About />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <LazyWrapper>
        <NotFound />
      </LazyWrapper>
    ),
  },
]);
