import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Drug } from "@/types";

interface DrugInfoProps {
  drug: Drug;
}

export function DrugInfo({ drug }: DrugInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{drug.genericName}</CardTitle>
            {drug.brandNames.length > 0 && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {drug.brandNames.join(", ")}
              </p>
            )}
          </div>
          <Badge variant="secondary">{drug.drugClass}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <span className="font-medium">IUPAC: </span>
          <span className="font-mono text-xs">{drug.iupacName}</span>
        </div>
        <div>
          <span className="font-medium">Formula: </span>
          <span className="font-mono text-xs">{drug.chemicalFormula}</span>
        </div>
        <div>
          <span className="font-medium">MOA: </span>
          <span>{drug.moa}</span>
        </div>
        <div>
          <span className="font-medium">Uses: </span>
          <span>{drug.uses.join("; ")}</span>
        </div>
        {drug.sarPoints.length > 0 && (
          <div>
            <span className="font-medium">SAR Points:</span>
            <ul className="ml-4 mt-1 list-disc space-y-0.5">
              {drug.sarPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
