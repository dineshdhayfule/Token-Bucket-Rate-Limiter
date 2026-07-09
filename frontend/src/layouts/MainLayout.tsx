import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="w-64 border-r hidden md:block">
        {/* Sidebar placeholder */}
        Sidebar
      </div>
      <div className="flex flex-col flex-1">
        <header className="h-16 border-b flex items-center px-4">
          {/* Navbar placeholder */}
          Navbar
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="h-12 border-t flex items-center px-4">
          {/* Footer placeholder */}
          Footer
        </footer>
      </div>
    </div>
  );
}
