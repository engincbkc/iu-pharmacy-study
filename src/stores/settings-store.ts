import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";

export type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

interface SettingsState {
  language: "en" | "tr";
  theme: Theme;
  sidebarOpen: boolean;
  setLanguage: (lang: "en" | "tr") => void;
  toggleLanguage: () => void;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: "en",
      theme: "light" as Theme,
      sidebarOpen: true,
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((s) => ({ language: s.language === "en" ? "tr" : "en" })),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      cycleTheme: () => {
        const order: Theme[] = ["light", "dark", "system"];
        const current = get().theme;
        const next = order[(order.indexOf(current) + 1) % order.length];
        applyTheme(next);
        set({ theme: next });
      },
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme);
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const { theme } = useSettingsStore.getState();
    if (theme === "system") applyTheme("system");
  });
}
