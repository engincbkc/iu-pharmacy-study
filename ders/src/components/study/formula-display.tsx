import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/use-i18n";
import type { Formula } from "@/types";

interface FormulaDisplayProps {
  formula: Formula;
}

export function FormulaDisplay({ formula }: FormulaDisplayProps) {
  const { t } = useI18n();

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl">{formula.name}</CardTitle>
            <CardDescription className="mt-1">{formula.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">{formula.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Equation box - prominent */}
        <div className="rounded-xl border-2 border-primary/10 bg-primary/5 px-4 py-6 sm:px-6">
          <p className="text-center font-mono text-lg font-bold tracking-wide text-primary sm:text-xl md:text-2xl">
            {formula.equation}
          </p>
        </div>

        {/* Variables grid */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("formulas.variables")}
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {formula.variables.map((v, i) => (
              <div key={i} className="flex items-baseline gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <span className="font-mono text-sm font-bold text-primary">{v.symbol}</span>
                <span className="text-sm text-muted-foreground">= {v.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {formula.example && (
          <>
            <Separator />
            <div className="rounded-lg border border-info/20 bg-info/5 p-4">
              <h4 className="mb-1.5 text-sm font-semibold text-info">{t("formulas.example")}</h4>
              <p className="text-sm leading-relaxed">{formula.example}</p>
            </div>
          </>
        )}

        <div>
          <h4 className="mb-1 text-sm font-semibold">{t("formulas.clinicalUse")}</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">{formula.clinicalUse}</p>
        </div>
      </CardContent>
    </Card>
  );
}
