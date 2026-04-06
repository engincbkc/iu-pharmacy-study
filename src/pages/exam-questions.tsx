import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  BookMarked,
  GraduationCap,
  Beaker,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import examData from "@/data/exam-questions.json";
import type { ExamYear, ExamQuestion } from "@/types";

// MCQ interactive component
function MCQQuestion({ question }: { question: ExamQuestion }) {
  const { t } = useI18n();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const examProgress = useProgressStore((s) => s.examProgress);
  const toggleExam = useProgressStore((s) => s.toggleExamQuestion);
  const reviewed = examProgress[question.id] ?? false;

  const isCorrect = checked && selectedOption === question.correctAnswer;

  const handleCheck = () => {
    if (!selectedOption) return;
    setChecked(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setChecked(false);
    setShowFullAnswer(false);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      checked && isCorrect && "border-emerald-300 shadow-emerald-100/50 shadow-lg",
      checked && !isCorrect && "border-red-300 shadow-red-100/50 shadow-lg",
      reviewed && !checked && "border-primary/20 bg-primary/[0.02]"
    )}>
      {/* Top color strip */}
      {checked && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("h-1 origin-left", isCorrect ? "bg-emerald-500" : "bg-red-500")}
        />
      )}

      <CardContent className="p-5">
        {/* Header badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="info" className="gap-1 text-[10px]">
            <FileText className="h-2.5 w-2.5" />
            MCQ
          </Badge>
          <Badge variant="outline" className="text-[10px]">{question.topic}</Badge>
          {reviewed && (
            <Badge variant="success" className="gap-1 text-[10px]">
              <BookMarked className="h-2.5 w-2.5" />
              Reviewed
            </Badge>
          )}
        </div>

        {/* Question text */}
        <p className="mb-4 text-base font-semibold leading-7 text-[#1a1a2e]">
          Q{question.questionNumber}: {question.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {question.options?.map((opt, i) => {
            const optLetter = String.fromCharCode(65 + i);
            const isThisCorrect = optLetter === question.correctAnswer;
            const isSelected = selectedOption === optLetter;

            return (
              <button
                key={i}
                type="button"
                disabled={checked}
                onClick={() => setSelectedOption(optLetter)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-all duration-150",
                  // Default state
                  !checked && !isSelected && "cursor-pointer border-border bg-card hover:border-primary/30 hover:bg-primary/5 active:scale-[0.99]",
                  // Selected but not checked
                  !checked && isSelected && "cursor-pointer border-primary bg-primary/5 shadow-sm",
                  // Checked - correct answer
                  checked && isThisCorrect && "border-emerald-400 bg-emerald-50",
                  // Checked - wrong selection
                  checked && isSelected && !isThisCorrect && "border-red-400 bg-red-50",
                  // Checked - other options
                  checked && !isThisCorrect && !isSelected && "cursor-default border-border bg-card opacity-50",
                )}
              >
                {/* Option indicator */}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    !checked && !isSelected && "border-muted-foreground/25 text-muted-foreground",
                    !checked && isSelected && "border-primary bg-primary text-primary-foreground",
                    checked && isThisCorrect && "border-emerald-500 bg-emerald-500 text-white",
                    checked && isSelected && !isThisCorrect && "border-red-500 bg-red-500 text-white",
                  )}
                >
                  {checked && isThisCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : checked && isSelected && !isThisCorrect ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    optLetter
                  )}
                </span>

                {/* Option text */}
                <span className={cn(
                  "leading-relaxed",
                  checked && isThisCorrect && "font-semibold text-emerald-800",
                  checked && isSelected && !isThisCorrect && "text-red-700 line-through",
                )}>
                  {opt.replace(/^[A-E]\)\s*/, "")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!checked ? (
            <Button
              onClick={handleCheck}
              disabled={!selectedOption}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Check Answer
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullAnswer(!showFullAnswer)}
                className="gap-1.5"
              >
                {showFullAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showFullAnswer ? "Hide Details" : "Show Details"}
              </Button>
            </>
          )}
          <Button
            variant={reviewed ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleExam(question.id)}
            className={cn("gap-1.5", reviewed && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200")}
          >
            <BookMarked className="h-3.5 w-3.5" />
            {reviewed ? "Reviewed" : "Mark Reviewed"}
          </Button>
        </div>

        {/* Feedback after checking */}
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={cn(
                "rounded-xl border-2 p-4",
                isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
              )}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <p className={cn("font-bold", isCorrect ? "text-emerald-700" : "text-red-700")}>
                    {isCorrect ? "Correct!" : `Incorrect - Answer is ${question.correctAnswer}`}
                  </p>
                </div>
                {question.answer.explanation && (
                  <p className="mt-2 text-sm leading-relaxed text-[#1a1a2e]/80">
                    {question.answer.explanation}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full answer details */}
        <AnimatePresence>
          {showFullAnswer && question.answer && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnswerDetails answer={question.answer} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Open-ended question component
function OpenEndedQuestion({ question }: { question: ExamQuestion }) {
  const { t } = useI18n();
  const [showAnswer, setShowAnswer] = useState(false);
  const examProgress = useProgressStore((s) => s.examProgress);
  const toggleExam = useProgressStore((s) => s.toggleExamQuestion);
  const reviewed = examProgress[question.id] ?? false;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      reviewed && "border-primary/20 bg-primary/[0.02]"
    )}>
      <CardContent className="p-5">
        {/* Header badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <Beaker className="h-2.5 w-2.5" />
            Open-Ended
          </Badge>
          <Badge variant="outline" className="text-[10px]">{question.topic}</Badge>
          {reviewed && (
            <Badge variant="success" className="gap-1 text-[10px]">
              <BookMarked className="h-2.5 w-2.5" />
              Reviewed
            </Badge>
          )}
        </div>

        {/* Question */}
        <p className="mb-4 text-base font-semibold leading-7 text-[#1a1a2e]">
          Q{question.questionNumber}: {question.question}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showAnswer ? "secondary" : "default"}
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="gap-1.5"
          >
            {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showAnswer ? t("exams.hideAnswer") : t("exams.showAnswer")}
          </Button>
          <Button
            variant={reviewed ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleExam(question.id)}
            className={cn("gap-1.5", reviewed && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200")}
          >
            <BookMarked className="h-3.5 w-3.5" />
            {reviewed ? "Reviewed" : "Mark Reviewed"}
          </Button>
        </div>

        {/* Answer */}
        <AnimatePresence>
          {showAnswer && question.answer && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnswerDetails answer={question.answer} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Shared answer details component
function AnswerDetails({ answer }: { answer: ExamQuestion["answer"] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-emerald-600" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700">Answer Details</h4>
      </div>

      {answer.iupacName && (
        <div className="rounded-lg bg-white/80 p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("exams.iupac")}</span>
          <p className="mt-1 font-mono text-sm font-medium text-[#1a1a2e]">{answer.iupacName}</p>
        </div>
      )}

      {answer.chemicalFormula && (
        <div className="rounded-lg bg-white/80 p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("exams.formula")}</span>
          <p className="mt-1 font-mono text-sm font-medium text-[#1a1a2e]">{answer.chemicalFormula}</p>
        </div>
      )}

      {answer.moa && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("exams.moa")}</span>
          <p className="mt-1 text-sm leading-relaxed text-[#1a1a2e]/90">{answer.moa}</p>
        </div>
      )}

      {answer.uses && answer.uses.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("exams.uses")}</span>
          <ul className="mt-1 space-y-1">
            {answer.uses.map((u, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-[#1a1a2e]/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      {answer.synthesis && answer.synthesis.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("exams.synthesis")}</span>
          <ol className="mt-1 space-y-1.5">
            {answer.synthesis.map((s) => (
              <li key={s.step} className="flex gap-2 text-sm leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-800">
                  {s.step}
                </span>
                <span className="text-[#1a1a2e]/90">
                  {s.description}
                  {s.reagents && (
                    <span className="ml-1 rounded bg-white/80 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {s.reagents}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {answer.keyPoints && answer.keyPoints.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">{t("exams.keyPoints")}</span>
          <ul className="mt-1 space-y-1">
            {answer.keyPoints.map((k, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-amber-900">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {k}
              </li>
            ))}
          </ul>
        </div>
      )}

      {answer.explanation && (
        <p className="text-sm leading-relaxed text-[#1a1a2e]/80">{answer.explanation}</p>
      )}

      {answer.text && (
        <p className="text-sm leading-relaxed text-[#1a1a2e]/80">{answer.text}</p>
      )}
    </div>
  );
}

// Main page
export function ExamQuestionsPage() {
  const { t } = useI18n();
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [examType, setExamType] = useState<"midterm" | "final">("midterm");
  const examProgress = useProgressStore((s) => s.examProgress);

  const years = examData.years as ExamYear[];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("exams.title")}</h1>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          <GraduationCap className="h-3.5 w-3.5" />
          {Object.values(examProgress).filter(Boolean).length} reviewed
        </Badge>
      </div>

      <div className="space-y-4">
        {years.map((year) => {
          const isExpanded = expandedYear === year.year;
          const questions = examType === "midterm" ? year.midterm : year.final;
          const reviewedInYear = questions.filter((q) => examProgress[q.id]).length;

          return (
            <Card key={year.year} className={cn(isExpanded && "shadow-lg")}>
              <CardHeader
                className="cursor-pointer select-none transition-colors hover:bg-muted/30 active:scale-[0.995]"
                onClick={() => setExpandedYear(isExpanded ? null : year.year)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                    <CardTitle className="text-lg">{year.year}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="exam" className="text-xs">
                      {year.midterm.length} {t("exams.midterm")}
                    </Badge>
                    <Badge variant="exam" className="text-xs">
                      {year.final.length} {t("exams.final")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="space-y-4 border-t pt-4">
                      {/* Exam type tabs */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={examType === "midterm" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExamType("midterm")}
                        >
                          {t("exams.midterm")} ({year.midterm.length})
                        </Button>
                        <Button
                          variant={examType === "final" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExamType("final")}
                        >
                          {t("exams.final")} ({year.final.length})
                        </Button>
                        {reviewedInYear > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {reviewedInYear}/{questions.length} reviewed
                          </span>
                        )}
                      </div>

                      {/* Questions */}
                      <div className="space-y-4">
                        {questions.map((q, i) => (
                          <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.3 }}
                          >
                            {q.type === "multiple-choice" ? (
                              <MCQQuestion question={q} />
                            ) : (
                              <OpenEndedQuestion question={q} />
                            )}
                          </motion.div>
                        ))}
                        {questions.length === 0 && (
                          <p className="py-8 text-center text-sm text-muted-foreground">
                            No questions available for this section.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
