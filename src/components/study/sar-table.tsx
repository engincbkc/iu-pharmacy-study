import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/use-i18n";
import type { SARTable as SARTableType } from "@/types";

interface SARTableProps {
  data: SARTableType;
}

export function SARTableView({ data }: SARTableProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{data.drugClass}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
        <div className="mt-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {data.baseStructure}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-2 text-sm font-semibold">{t("sar.modifications")}</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("sar.position")}</TableHead>
                <TableHead>{t("sar.group")}</TableHead>
                <TableHead>{t("sar.effect")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.modifications.map((mod, i) => (
                <TableRow key={i} className="even:bg-muted/50">
                  <TableCell className="font-mono text-xs font-medium">
                    {mod.position}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{mod.group}</TableCell>
                  <TableCell className="text-sm">{mod.effect}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.clinicalExamples.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">{t("sar.clinicalExamples")}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug</TableHead>
                  <TableHead>Modification</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.clinicalExamples.map((ex, i) => (
                  <TableRow key={i} className="even:bg-muted/50">
                    <TableCell className="font-medium">{ex.drug}</TableCell>
                    <TableCell className="text-sm">{ex.modification}</TableCell>
                    <TableCell className="text-sm">{ex.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
