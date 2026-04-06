import { Link } from "react-router-dom";
import {
  BookOpen,
  Layers,
  CircleHelp,
  FileText,
  FlaskConical,
  Calculator,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import topicsData from "@/data/topics.json";
import flashcardsData from "@/data/flashcards.json";

export function DashboardPage() {
  const { t } = useI18n();
  const completedTopics = useProgressStore((s) => s.completedTopics);
  const flashcardProgress = useProgressStore((s) => s.flashcardProgress);
  const quizScores = useProgressStore((s) => s.quizScores);

  const totalTopics = topicsData.topics.length;
  const topicPct = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

  const totalFlashcards = flashcardsData.flashcards.length;
  const knownCards = Object.values(flashcardProgress).filter((f) => f.known).length;

  const avgScore =
    quizScores.length > 0
      ? Math.round(
          quizScores.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions) * 100, 0) /
            quizScores.length
        )
      : 0;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Hero section */}
      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("dashboard.welcome")}</h1>
            <p className="mt-1 text-muted-foreground">{t("dashboard.subtitle")}</p>
          </div>
          <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm font-semibold">
            {topicPct}% Complete
          </Badge>
        </div>
        <div className="mt-4">
          <Progress value={topicPct} className="h-2.5" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.topicsCompleted")}
                </p>
                <p className="mt-1 text-3xl font-bold">{completedTopics.length}</p>
                <p className="text-xs text-muted-foreground">of {totalTopics} topics</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.flashcardsReviewed")}
                </p>
                <p className="mt-1 text-3xl font-bold">{knownCards}</p>
                <p className="text-xs text-muted-foreground">of {totalFlashcards} cards</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.quizzesTaken")}
                </p>
                <p className="mt-1 text-3xl font-bold">{quizScores.length}</p>
                <p className="text-xs text-muted-foreground">total quizzes</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.avgScore")}
                </p>
                <p className="mt-1 text-3xl font-bold">{avgScore}%</p>
                <p className="text-xs text-muted-foreground">average</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Award className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start */}
      <div>
        <h2 className="mb-4 text-lg font-bold">{t("dashboard.quickStart")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              to: "/topics",
              icon: BookOpen,
              label: t("dashboard.continueStudying"),
              desc: `${totalTopics - completedTopics.length} topics remaining`,
              color: "text-primary",
              bg: "bg-primary/5 hover:bg-primary/10",
            },
            {
              to: "/quiz",
              icon: CircleHelp,
              label: t("dashboard.startQuiz"),
              desc: "Test your knowledge",
              color: "text-info",
              bg: "bg-info/5 hover:bg-info/10",
            },
            {
              to: "/flashcards",
              icon: Layers,
              label: t("dashboard.reviewFlashcards"),
              desc: `${totalFlashcards - knownCards} cards to review`,
              color: "text-success",
              bg: "bg-success/5 hover:bg-success/10",
            },
            {
              to: "/exams",
              icon: FileText,
              label: t("nav.exams"),
              desc: "Past exam questions 2021-2025",
              color: "text-exam",
              bg: "bg-exam/5 hover:bg-exam/10",
            },
            {
              to: "/sar",
              icon: FlaskConical,
              label: t("nav.sar"),
              desc: "Structure-Activity Relationships",
              color: "text-warning",
              bg: "bg-warning/5 hover:bg-warning/10",
            },
            {
              to: "/formulas",
              icon: Calculator,
              label: t("nav.formulas"),
              desc: "Key equations & constants",
              color: "text-primary",
              bg: "bg-primary/5 hover:bg-primary/10",
            },
          ].map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${bg}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
