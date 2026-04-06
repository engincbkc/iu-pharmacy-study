import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuizCard } from "./quiz-card";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw, ListChecks, Trophy, Target, ArrowRight } from "lucide-react";
import type { QuizQuestion } from "@/types";

interface QuizSessionProps {
  questions: QuizQuestion[];
  onFinish: () => void;
  onRetryWrong?: (wrongIds: string[]) => void;
}

export function QuizSession({ questions, onFinish, onRetryWrong }: QuizSessionProps) {
  const { t } = useI18n();
  const addQuizScore = useProgressStore((s) => s.addQuizScore);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong">("all");

  const current = questions[currentIndex];
  const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  const results = useMemo(() => {
    if (!finished) return { correct: 0, total: 0, wrongIds: [] as string[], pct: 0 };
    let correct = 0;
    const wrongIds: string[] = [];
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
      else wrongIds.push(q.id);
    });
    return { correct, total: questions.length, wrongIds, pct: Math.round((correct / questions.length) * 100) };
  }, [finished, answers, questions]);

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: selectedAnswer }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleFinish = () => {
    if (!showResult && selectedAnswer) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: selectedAnswer }));
    }
    const finalAnswers = { ...answers, [currentIndex]: selectedAnswer ?? "" };
    let correct = 0;
    const wrongIds: string[] = [];
    questions.forEach((q, i) => {
      if (finalAnswers[i] === q.correctAnswer) correct++;
      else wrongIds.push(q.id);
    });
    setAnswers(finalAnswers);
    addQuizScore({
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers: correct,
      topics: [...new Set(questions.map((q) => q.topic))],
      wrongQuestionIds: wrongIds,
    });
    setFinished(true);
  };

  // Review mode
  if (showReview) {
    const reviewQuestions = reviewFilter === "wrong"
      ? questions.filter((_, i) => answers[i] !== questions[i].correctAnswer)
      : questions;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Review Answers</h3>
          <div className="flex gap-2">
            <Button
              variant={reviewFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setReviewFilter("all")}
            >
              All ({questions.length})
            </Button>
            <Button
              variant={reviewFilter === "wrong" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setReviewFilter("wrong")}
            >
              Wrong ({results.wrongIds.length})
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {reviewQuestions.map((q) => {
            const qIdx = questions.indexOf(q);
            const userAnswer = answers[qIdx];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <Card key={q.id} className={cn("overflow-hidden", isCorrect ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500")}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs font-semibold text-muted-foreground">Q{qIdx + 1}</span>
                    <Badge variant="outline" className="text-[10px]">{q.topic}</Badge>
                  </div>
                  <p className="mb-3 font-medium leading-relaxed">{q.question}</p>

                  <div className="space-y-1.5">
                    {q.options.map((opt) => {
                      const isUserChoice = opt.id === userAnswer;
                      const isCorrectOpt = opt.id === q.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm",
                            isCorrectOpt && "border-emerald-300 bg-emerald-50 font-medium text-emerald-800",
                            isUserChoice && !isCorrectOpt && "border-red-300 bg-red-50 text-red-800 line-through"
                          )}
                        >
                          <span className="mr-2 font-mono text-xs font-bold text-muted-foreground">{opt.id})</span>
                          {opt.text}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    {q.explanation}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setShowReview(false)}>Back to Results</Button>
          <Button onClick={onFinish}>New Quiz</Button>
        </div>
      </div>
    );
  }

  // Results screen
  if (finished) {
    const grade = results.pct >= 90 ? "A" : results.pct >= 80 ? "B" : results.pct >= 70 ? "C" : results.pct >= 60 ? "D" : "F";
    const gradeColor = results.pct >= 80 ? "text-emerald-600" : results.pct >= 60 ? "text-amber-600" : "text-red-600";

    return (
      <Card className="overflow-hidden">
        <div className={cn("h-2", results.pct >= 80 ? "bg-emerald-500" : results.pct >= 60 ? "bg-amber-500" : "bg-red-500")} />
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{t("quiz.results")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score display */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold tabular-nums">{results.pct}</span>
              <span className="text-2xl font-bold text-muted-foreground">%</span>
              <span className={cn("ml-2 text-3xl font-black", gradeColor)}>{grade}</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              {results.correct} correct, {results.total - results.correct} wrong out of {results.total}
            </p>
          </div>

          <Progress value={results.pct} className="h-3" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-lg border bg-emerald-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xl font-bold text-emerald-700">{results.correct}</p>
                <p className="text-xs text-emerald-600">{t("quiz.correct")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-red-50 p-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-xl font-bold text-red-700">{results.total - results.correct}</p>
                <p className="text-xs text-red-600">{t("quiz.incorrect")}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => setShowReview(true)} className="gap-2">
              <ListChecks className="h-4 w-4" />
              Review Answers
            </Button>
            {results.wrongIds.length > 0 && onRetryWrong && (
              <Button
                variant="outline"
                onClick={() => onRetryWrong(results.wrongIds)}
                className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
              >
                <RotateCcw className="h-4 w-4" />
                Retry Wrong ({results.wrongIds.length})
              </Button>
            )}
            <Button onClick={onFinish} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />

      <Card>
        <CardContent className="p-5 sm:p-6">
          <QuizCard
            question={current}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onAnswer={setSelectedAnswer}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {!showResult ? (
          <Button onClick={handleCheck} disabled={!selectedAnswer} className="min-w-[140px]">
            {t("quiz.checkAnswer")}
          </Button>
        ) : currentIndex < questions.length - 1 ? (
          <Button onClick={handleNext} className="min-w-[140px]">
            {t("quiz.next")} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} className="min-w-[140px]">
            {t("quiz.finish")} <Trophy className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
