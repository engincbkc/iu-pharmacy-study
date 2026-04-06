import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  CircleHelp,
  FileText,
  FlaskConical,
  Calculator,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/use-i18n";
import { NAV_ITEMS } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgressStore } from "@/stores/progress-store";
import topicsData from "@/data/topics.json";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  Layers,
  CircleHelp,
  FileText,
  FlaskConical,
  Calculator,
};

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const { t } = useI18n();
  const completedTopics = useProgressStore((s) => s.completedTopics);
  const totalTopics = topicsData.topics.length;
  const progressPct = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-sidebar-background text-sidebar-foreground",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-primary-foreground">PharmChem</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/60">Study Platform</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="border-b border-sidebar-border px-5 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-sidebar-foreground/60">Progress</span>
          <span className="font-semibold text-sidebar-primary">{progressPct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sidebar-accent">
          <div
            className="h-full rounded-full bg-sidebar-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                {Icon && (
                  <Icon className="h-4 w-4 shrink-0" />
                )}
                {t(item.labelKey)}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-[10px] text-sidebar-foreground/40">
          Istanbul University - Faculty of Pharmacy
        </p>
        <p className="text-[10px] text-sidebar-foreground/40">
          Pharmaceutical Chemistry 2
        </p>
      </div>
    </aside>
  );
}
