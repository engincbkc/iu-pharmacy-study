import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";

interface SettingsState {
  language: "en" | "tr";
  sidebarOpen: boolean;
  setLanguage: (lang: "en" | "tr") => void;
  toggleLanguage: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "en",
      sidebarOpen: true,
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((s) => ({ language: s.language === "en" ? "tr" : "en" })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: STORAGE_KEYS.SETTINGS }
  )
);
