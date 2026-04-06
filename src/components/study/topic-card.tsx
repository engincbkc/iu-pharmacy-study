import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, AlertTriangle, Lightbulb, Pill, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import type { Topic } from "@/types";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();
  const completedTopics = useProgressStore((s) => s.completedTopics);
  const toggleTopic = useProgressStore((s) => s.toggleTopic);
  const isCompleted = completedTopics.includes(topic.id);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        isCompleted && "border-emerald-300/50 bg-emerald-50/30",
        !isCompleted && "hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <CardHeader
        className="cursor-pointer select-none transition-colors duration-150 hover:bg-muted/40"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-1 shrink-0"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
            <div className="min-w-0">
              <CardTitle className="text-base leading-snug sm:text-lg">{topic.title}</CardTitle>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {topic.summary}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
              {topic.category}
            </Badge>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Badge variant="success" className="gap-1 text-[10px]">
                  <Check className="h-2.5 w-2.5" />
                  Done
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-6 border-t bg-muted/10 pt-6">
              {topic.content.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
                      {section.heading}
                    </h4>
                  </div>

                  {section.type === "list" && section.items ? (
                    <ul className="space-y-2 pl-6 text-sm leading-7">
                      {section.items.map((item, j) => (
                        <li key={j} className="relative pl-4">
                          <span className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full bg-primary/30" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : section.type === "table" && section.tableData ? (
                    <div className="overflow-x-auto rounded-xl border shadow-sm">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/60">
                            {section.tableData.headers.map((h, j) => (
                              <th key={j} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.tableData.rows.map((row, j) => (
                            <tr key={j} className="border-b last:border-0 even:bg-muted/20 hover:bg-primary/5 transition-colors">
                              {row.map((cell, k) => (
                                <td key={k} className="px-4 py-2.5 text-sm leading-relaxed text-foreground/90">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-foreground/85">{section.body}</p>
                  )}
                </motion.div>
              ))}

              {/* Key Points - Highlighted tips */}
              {topic.keyPoints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: topic.content.length * 0.05, duration: 0.3 }}
                  className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-amber-800">
                      {t("topics.keyPoints")}
                    </h4>
                    <Badge className="bg-amber-200 text-amber-800 text-[10px] border-0">
                      Exam Tips
                    </Badge>
                  </div>
                  <ul className="space-y-2">
                    {topic.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-amber-900">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Related Drugs */}
              {topic.relatedDrugs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (topic.content.length + 1) * 0.05, duration: 0.3 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Pill className="h-4 w-4 text-info" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("topics.relatedDrugs")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.relatedDrugs.map((drug) => (
                      <Badge
                        key={drug}
                        variant="outline"
                        className="rounded-full border-info/30 bg-info/5 text-xs font-medium text-info"
                      >
                        {drug}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Complete button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant={isCompleted ? "secondary" : "default"}
                  size="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTopic(topic.id);
                  }}
                  className={cn(
                    "gap-2 transition-all duration-200",
                    isCompleted && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  )}
                >
                  {isCompleted && <Check className="h-4 w-4" />}
                  {isCompleted ? "Completed" : t("topics.markComplete")}
                </Button>
              </motion.div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
