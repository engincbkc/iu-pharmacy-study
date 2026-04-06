import { Menu, Languages, PanelLeftClose, PanelLeft, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore, type Theme } from "@/stores/settings-store";
import { CommandSearch } from "./command-search";

const themeIcon: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabel: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function Header() {
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar);
  const toggleLanguage = useSettingsStore((s) => s.toggleLanguage);
  const language = useSettingsStore((s) => s.language);
  const sidebarOpen = useSettingsStore((s) => s.sidebarOpen);
  const theme = useSettingsStore((s) => s.theme);
  const cycleTheme = useSettingsStore((s) => s.cycleTheme);

  const ThemeIcon = themeIcon[theme];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden lg:flex"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 px-4 sm:px-8">
        <div className="mx-auto max-w-md">
          <CommandSearch />
        </div>
      </div>

      {/* Right: Theme + Language */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          aria-label={`Theme: ${themeLabel[theme]}`}
          title={`Theme: ${themeLabel[theme]} (click to cycle)`}
          className="h-9 w-9 rounded-full"
        >
          <ThemeIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="gap-1.5 rounded-full"
        >
          <Languages className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{language.toUpperCase()}</span>
        </Button>
      </div>
    </header>
  );
}
