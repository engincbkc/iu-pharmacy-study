import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useSettingsStore } from "@/stores/settings-store";
import { cn } from "@/lib/utils";

export function Shell() {
  const sidebarOpen = useSettingsStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar
        className={cn(
          "hidden transition-all duration-300 lg:flex",
          !sidebarOpen && "lg:hidden"
        )}
      />

      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          sidebarOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => useSettingsStore.getState().setSidebarOpen(false)}
        />
        <div
          className={cn(
            "relative z-50 h-full transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar
            className="flex"
            onNavigate={() => useSettingsStore.getState().setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[960px] px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
