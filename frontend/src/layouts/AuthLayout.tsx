import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Outlet />
    </div>
  );
}
