import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import {
  BookOpen,
  Layers,
  CircleHelp,
  FileText,
  FlaskConical,
  Calculator,
  Pill,
  Search,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useI18n } from "@/i18n/use-i18n";
import topicsData from "@/data/topics.json";
import drugsData from "@/data/drugs.json";
import sarData from "@/data/sar-tables.json";
import type { Topic, Drug, SARTable } from "@/types";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const topics = topicsData.topics as Topic[];
  const drugs = drugsData.drugs as Drug[];
  const sarTables = sarData.tables as SARTable[];

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">{t("common.search")}</span>
        <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium sm:inline-block">
          Cmd+K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-2xl">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Search topics, drugs, flashcards, SAR..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[350px] overflow-y-auto overflow-x-hidden p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              {/* Pages */}
              <Command.Group heading="Pages">
                <Command.Item onSelect={() => go("/")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  {t("nav.dashboard")}
                </Command.Item>
                <Command.Item onSelect={() => go("/topics")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  {t("nav.topics")}
                </Command.Item>
                <Command.Item onSelect={() => go("/flashcards")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  {t("nav.flashcards")}
                </Command.Item>
                <Command.Item onSelect={() => go("/quiz")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <CircleHelp className="h-4 w-4 text-muted-foreground" />
                  {t("nav.quiz")}
                </Command.Item>
                <Command.Item onSelect={() => go("/exams")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {t("nav.exams")}
                </Command.Item>
                <Command.Item onSelect={() => go("/sar")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                  {t("nav.sar")}
                </Command.Item>
                <Command.Item onSelect={() => go("/formulas")} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  {t("nav.formulas")}
                </Command.Item>
              </Command.Group>

              {/* Topics */}
              <Command.Group heading="Topics">
                {topics.map((topic) => (
                  <Command.Item
                    key={topic.id}
                    value={`${topic.title} ${topic.category} ${topic.relatedDrugs.join(" ")}`}
                    onSelect={() => go("/topics")}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <BookOpen className="h-4 w-4 text-primary/60" />
                    <div>
                      <p className="font-medium">{topic.title}</p>
                      <p className="text-xs text-muted-foreground">{topic.category}</p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Drugs */}
              <Command.Group heading="Drugs">
                {drugs.map((drug) => (
                  <Command.Item
                    key={drug.id}
                    value={`${drug.genericName} ${drug.iupacName} ${drug.drugClass} ${drug.brandNames.join(" ")}`}
                    onSelect={() => go("/topics")}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <Pill className="h-4 w-4 text-info/60" />
                    <div>
                      <p className="font-medium">{drug.genericName}</p>
                      <p className="text-xs text-muted-foreground">{drug.drugClass}</p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>

              {/* SAR Tables */}
              <Command.Group heading="SAR Tables">
                {sarTables.map((table) => (
                  <Command.Item
                    key={table.id}
                    value={`${table.drugClass} SAR ${table.description}`}
                    onSelect={() => go("/sar")}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <FlaskConical className="h-4 w-4 text-warning/60" />
                    <p className="font-medium">{table.drugClass} SAR</p>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
