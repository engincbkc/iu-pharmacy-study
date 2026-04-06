import { useState, useMemo, lazy, Suspense } from "react";
import { useI18n } from "@/i18n/use-i18n";
import { Button } from "@/components/ui/button";
import { SARTableView } from "@/components/study/sar-table";
import sarData from "@/data/sar-tables.json";
import moleculesData from "@/data/molecules.json";
import type { SARTable, MoleculeData } from "@/types";

const MoleculeViewer = lazy(() =>
  import("@/components/molecules/molecule-viewer").then((m) => ({
    default: m.MoleculeViewer,
  }))
);

const sarToMoleculeMap: Record<string, string> = {
  "beta-blockers": "beta-blocker-core",
  "barbiturates": "barbituric-acid",
  "penicillins": "penicillin-core",
  "phenothiazines": "phenothiazine-core",
  "benzodiazepines": "benzodiazepine-core",
  "fluoroquinolones": "fluoroquinolone-core",
};

export function SARReferencePage() {
  const { t } = useI18n();
  const tables = sarData.tables as SARTable[];
  const molecules = moleculesData.molecules as MoleculeData[];

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTable = useMemo(
    () => (selectedId ? tables.find((t) => t.id === selectedId) : null),
    [tables, selectedId]
  );

  const linkedMolecule = useMemo(() => {
    if (!selectedId) return null;
    const molId = sarToMoleculeMap[selectedId];
    return molId ? molecules.find((m) => m.id === molId) : null;
  }, [selectedId, molecules]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("sar.title")}</h1>

      <div className="flex flex-wrap gap-2">
        {tables.map((table) => (
          <Button
            key={table.id}
            variant={selectedId === table.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedId(selectedId === table.id ? null : table.id)}
          >
            {table.drugClass}
          </Button>
        ))}
      </div>

      {selectedTable ? (
        <div className="space-y-6">
          <SARTableView data={selectedTable} />

          {linkedMolecule && (
            <Suspense fallback={<div className="py-4 text-center text-muted-foreground">{t("common.loading")}</div>}>
              <MoleculeViewer molecule={linkedMolecule} />
            </Suspense>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tables.map((table) => (
            <SARTableView key={table.id} data={table} />
          ))}
        </div>
      )}
    </div>
  );
}
