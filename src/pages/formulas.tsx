import { useI18n } from "@/i18n/use-i18n";
import { FormulaDisplay } from "@/components/study/formula-display";
import formulasData from "@/data/formulas.json";
import type { Formula } from "@/types";

export function FormulasPage() {
  const { t } = useI18n();
  const formulas = formulasData.formulas as Formula[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("formulas.title")}</h1>

      <div className="grid gap-6">
        {formulas.map((formula) => (
          <FormulaDisplay key={formula.id} formula={formula} />
        ))}
      </div>
    </div>
  );
}
