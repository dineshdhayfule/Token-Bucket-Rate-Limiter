import { createBrowserRouter } from "react-router";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Playground from "@/pages/Playground";
import Buckets from "@/pages/Buckets";
import Clients from "@/pages/Clients";
import Metrics from "@/pages/Metrics";
import Traffic from "@/pages/Traffic";
import Architecture from "@/pages/Architecture";
import RequestFlow from "@/pages/RequestFlow";
import ApiExplorer from "@/pages/ApiExplorer";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "playground", element: <Playground /> },
      { path: "buckets", element: <Buckets /> },
      { path: "clients", element: <Clients /> },
      { path: "metrics", element: <Metrics /> },
      { path: "traffic", element: <Traffic /> },
      { path: "architecture", element: <Architecture /> },
      { path: "request-flow", element: <RequestFlow /> },
      { path: "api-explorer", element: <ApiExplorer /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
    ],
  },
]);
