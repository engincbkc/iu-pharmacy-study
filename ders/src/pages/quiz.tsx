import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizSession } from "@/components/study/quiz-session";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import quizData from "@/data/quiz-questions.json";
import type { QuizQuestion } from "@/types";
import { CircleHelp, RotateCcw, TrendingUp } from "lucide-react";

export function QuizPage() {
  const { t } = useI18n();
  const quizScores = useProgressStore((s) => s.quizScores);
  const [active, setActive] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [retryIds, setRetryIds] = useState<string[] | null>(null);

  const allQuestions = quizData.questions as QuizQuestion[];
  const topics = useMemo(() => [...new Set(allQuestions.map((q) => q.topic))], [allQuestions]);

  const sessionQuestions = useMemo(() => {
    if (retryIds) {
      return allQuestions.filter((q) => retryIds.includes(q.id));
    }
    let pool = allQuestions;
    if (selectedTopic) pool = pool.filter((q) => q.topic === selectedTopic);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  }, [allQuestions, selectedTopic, questionCount, retryIds]);

  const handleRetryWrong = useCallback((wrongIds: string[]) => {
    setRetryIds(wrongIds);
    setActive(true);
  }, []);

  const handleFinish = useCallback(() => {
    setActive(false);
    setRetryIds(null);
  }, []);

  // Recent stats
  const recentScores = quizScores.slice(-5).reverse();
  const overallAvg = quizScores.length > 0
    ? Math.round(quizScores.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions) * 100, 0) / quizScores.length)
    : 0;

  if (active && sessionQuestions.length > 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {retryIds ? "Retry Wrong Answers" : t("quiz.title")}
        </h1>
        <QuizSession
          questions={sessionQuestions}
          onFinish={handleFinish}
          onRetryWrong={handleRetryWrong}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("quiz.title")}</h1>

      {/* Stats row */}
      {quizScores.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <CircleHelp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold tabular-nums">{quizScores.length}</p>
              <p className="text-xs text-muted-foreground">Quizzes Taken</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xl font-bold tabular-nums">{overallAvg}%</p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </div>
          </div>
          {recentScores.length > 0 && (
            <div className="col-span-2 flex items-center gap-2 rounded-lg border bg-card p-4 sm:col-span-1">
              <div className="flex gap-1">
                {recentScores.map((s, i) => {
                  const pct = Math.round((s.correctAnswers / s.totalQuestions) * 100);
                  return (
                    <div
                      key={i}
                      className={`h-8 w-2 rounded-full ${pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ height: `${Math.max(8, pct * 0.32)}px` }}
                      title={`${pct}%`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">Recent</p>
            </div>
          )}
        </div>
      )}

      {/* Last wrong questions retry */}
      {quizScores.length > 0 && quizScores[quizScores.length - 1].wrongQuestionIds.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-red-800">
                {quizScores[quizScores.length - 1].wrongQuestionIds.length} wrong answers from last quiz
              </p>
              <p className="text-xs text-red-600">Practice makes perfect - retry them!</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRetryWrong(quizScores[quizScores.length - 1].wrongQuestionIds)}
              className="gap-1.5 border-red-300 text-red-700 hover:bg-red-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("quiz.start")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Topic selection */}
          <div>
            <label className="mb-2 block text-sm font-semibold">{t("quiz.selectTopic")}</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTopic(null)}
              >
                {t("quiz.allTopics")} ({allQuestions.length})
              </Button>
              {topics.map((topic) => {
                const count = allQuestions.filter((q) => q.topic === topic).length;
                return (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Question count */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Number of questions</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((n) => (
                <Button
                  key={n}
                  variant={questionCount === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setQuestionCount(n)}
                  className="min-w-[48px]"
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setActive(true)} size="lg" className="gap-2">
              <CircleHelp className="h-4 w-4" />
              {t("quiz.start")}
            </Button>
            <Badge variant="secondary" className="px-3 py-1.5">
              {Math.min(questionCount, selectedTopic
                ? allQuestions.filter((q) => q.topic === selectedTopic).length
                : allQuestions.length
              )} questions
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
