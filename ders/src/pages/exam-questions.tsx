import { useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import examData from "@/data/exam-questions.json";
import type { ExamYear, ExamQuestion } from "@/types";

function ExamQuestionCard({ question }: { question: ExamQuestion }) {
  const { t } = useI18n();
  const [showAnswer, setShowAnswer] = useState(false);
  const examProgress = useProgressStore((s) => s.examProgress);
  const toggleExam = useProgressStore((s) => s.toggleExamQuestion);
  const reviewed = examProgress[question.id] ?? false;

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant={question.type === "multiple-choice" ? "info" : "secondary"}>
              {question.type === "multiple-choice" ? t("exams.multipleChoice") : t("exams.openEnded")}
            </Badge>
            <Badge variant="outline">{question.topic}</Badge>
            {reviewed && <Badge variant="success">Reviewed</Badge>}
          </div>
          <p className="font-medium">
            {t("exams.question")} {question.questionNumber}: {question.question}
          </p>

          {question.options && (
            <div className="mt-2 space-y-1 text-sm">
              {question.options.map((opt, i) => (
                <p
                  key={i}
                  className={
                    showAnswer && question.correctAnswer === String.fromCharCode(65 + i)
                      ? "font-semibold text-success"
                      : ""
                  }
                >
                  {opt}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAnswer(!showAnswer)}
          className="gap-1.5"
        >
          {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showAnswer ? t("exams.hideAnswer") : t("exams.showAnswer")}
        </Button>
        <Button
          variant={reviewed ? "secondary" : "outline"}
          size="sm"
          onClick={() => toggleExam(question.id)}
        >
          {reviewed ? "Reviewed" : "Mark Reviewed"}
        </Button>
      </div>

      {showAnswer && question.answer && (
        <div className="mt-3 space-y-2 rounded-md border border-success/30 bg-success/5 p-4 text-sm">
          {question.answer.iupacName && (
            <p>
              <span className="font-medium">{t("exams.iupac")}: </span>
              <span className="font-mono text-xs">{question.answer.iupacName}</span>
            </p>
          )}
          {question.answer.chemicalFormula && (
            <p>
              <span className="font-medium">{t("exams.formula")}: </span>
              <span className="font-mono text-xs">{question.answer.chemicalFormula}</span>
            </p>
          )}
          {question.answer.moa && (
            <p>
              <span className="font-medium">{t("exams.moa")}: </span>
              {question.answer.moa}
            </p>
          )}
          {question.answer.uses && question.answer.uses.length > 0 && (
            <div>
              <span className="font-medium">{t("exams.uses")}: </span>
              <ul className="ml-4 list-disc">
                {question.answer.uses.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
          {question.answer.synthesis && question.answer.synthesis.length > 0 && (
            <div>
              <span className="font-medium">{t("exams.synthesis")}: </span>
              <ol className="ml-4 list-decimal">
                {question.answer.synthesis.map((s) => (
                  <li key={s.step}>
                    {s.description}
                    {s.reagents && (
                      <span className="ml-1 font-mono text-xs text-muted-foreground">
                        [{s.reagents}]
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {question.answer.keyPoints && question.answer.keyPoints.length > 0 && (
            <div>
              <span className="font-medium">{t("exams.keyPoints")}: </span>
              <ul className="ml-4 list-disc">
                {question.answer.keyPoints.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          )}
          {question.answer.explanation && (
            <p>
              <span className="font-medium">Explanation: </span>
              {question.answer.explanation}
            </p>
          )}
          {question.answer.text && (
            <p>{question.answer.text}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ExamQuestionsPage() {
  const { t } = useI18n();
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [examType, setExamType] = useState<"midterm" | "final">("midterm");

  const years = examData.years as ExamYear[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("exams.title")}</h1>

      <div className="space-y-4">
        {years.map((year) => {
          const isExpanded = expandedYear === year.year;
          const questions = examType === "midterm" ? year.midterm : year.final;

          return (
            <Card key={year.year}>
              <CardHeader
                className="cursor-pointer select-none"
                onClick={() => setExpandedYear(isExpanded ? null : year.year)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <CardTitle className="text-lg">
                      {year.year}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="exam">
                      {year.midterm.length} {t("exams.midterm")}
                    </Badge>
                    <Badge variant="exam">
                      {year.final.length} {t("exams.final")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={examType === "midterm" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExamType("midterm")}
                    >
                      {t("exams.midterm")}
                    </Button>
                    <Button
                      variant={examType === "final" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExamType("final")}
                    >
                      {t("exams.final")}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {questions.map((q) => (
                      <ExamQuestionCard key={q.id} question={q} />
                    ))}
                    {questions.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No questions available for this section.
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
