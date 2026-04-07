import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  EyeOff,
  Eye,
  Timer,
  Flame,
  BarChart3,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Flashcard } from "@/components/study/flashcard";
import { useI18n } from "@/i18n/use-i18n";
import { useProgressStore } from "@/stores/progress-store";
import flashcardsData from "@/data/flashcards.json";
import { cn } from "@/lib/utils";
import type { Flashcard as FlashcardType, ConfidenceLevel, MasteryLevel } from "@/types";

const confidenceConfig: { level: ConfidenceLevel; label: string; shortcut: string; color: string; bg: string }[] = [
  { level: "again", label: "Again", shortcut: "1", color: "text-red-700", bg: "cursor-pointer border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 active:scale-95" },
  { level: "hard", label: "Hard", shortcut: "2", color: "text-orange-700", bg: "cursor-pointer border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 active:scale-95" },
  { level: "good", label: "Good", shortcut: "3", color: "text-emerald-700", bg: "cursor-pointer border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 active:scale-95" },
  { level: "easy", label: "Easy", shortcut: "4", color: "text-sky-700", bg: "cursor-pointer border-sky-200 bg-sky-50 hover:bg-sky-100 hover:border-sky-300 active:scale-95" },
];

const masteryOrder: MasteryLevel[] = ["new", "learning", "reviewing", "familiar", "mastered"];
const masteryColorMap: Record<MasteryLevel, string> = {
  new: "bg-zinc-300",
  learning: "bg-red-400",
  reviewing: "bg-amber-400",
  familiar: "bg-blue-400",
  mastered: "bg-emerald-400",
};

export function FlashcardsPage() {
  const { t } = useI18n();
  const flashcardProgress = useProgressStore((s) => s.flashcardProgress);
  const rateFlashcard = useProgressStore((s) => s.rateFlashcard);
  const resetFlashcards = useProgressStore((s) => s.resetFlashcards);
  const updateStreak = useProgressStore((s) => s.updateStreak);

  const allCards = flashcardsData.flashcards as FlashcardType[];
  const categories = useMemo(() => [...new Set(allCards.map((c) => c.category))], [allCards]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hideKnown, setHideKnown] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Filter cards
  const cards = useMemo(() => {
    let pool = allCards;
    if (selectedCategory) pool = pool.filter((c) => c.category === selectedCategory);
    if (hideKnown) pool = pool.filter((c) => {
      const status = flashcardProgress[c.id];
      return !status || status.masteryLevel !== "mastered";
    });
    return pool;
  }, [allCards, selectedCategory, hideKnown, flashcardProgress]);

  const current = cards[currentIndex];

  // Stats
  const masteredCount = Object.values(flashcardProgress).filter((f) => f.masteryLevel === "mastered" || f.masteryLevel === "familiar").length;

  // Mastery distribution
  const masteryDist = useMemo(() => {
    const dist: Record<MasteryLevel, number> = { new: 0, learning: 0, reviewing: 0, familiar: 0, mastered: 0 };
    allCards.forEach((c) => {
      const status = flashcardProgress[c.id];
      dist[status?.masteryLevel ?? "new"]++;
    });
    return dist;
  }, [allCards, flashcardProgress]);

  // Session time
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStartTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const goNext = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const shuffleCards = useCallback(() => {
    setFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * cards.length));
  }, [cards.length]);

  const handleRate = useCallback(
    (confidence: ConfidenceLevel) => {
      if (!current) return;
      rateFlashcard(current.id, confidence);
      updateStreak();
      setSessionReviewed((n) => n + 1);
      if (confidence === "good" || confidence === "easy") setSessionCorrect((n) => n + 1);
      goNext();
    },
    [current, rateFlashcard, updateStreak, goNext]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "f") { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === "ArrowRight" || e.key === "n") goNext();
      if (e.key === "ArrowLeft" || e.key === "p") goPrev();
      if (e.key === "s") shuffleCards();
      if (flipped) {
        if (e.key === "1") handleRate("again");
        if (e.key === "2") handleRate("hard");
        if (e.key === "3") handleRate("good");
        if (e.key === "4") handleRate("easy");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipped, goNext, goPrev, shuffleCards, handleRate]);

  if (cards.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("flashcards.title")}</h1>
        {hideKnown ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg font-semibold">All cards mastered!</p>
              <p className="mt-1 text-sm text-muted-foreground">Turn off "Hide known" to review all cards again.</p>
              <Button variant="outline" className="mt-4" onClick={() => setHideKnown(false)}>
                <Eye className="mr-2 h-4 w-4" /> Show all cards
              </Button>
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground">No flashcards available.</p>
        )}
      </div>
    );
  }

  const currentStatus = current ? flashcardProgress[current.id] : undefined;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("flashcards.title")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={showShortcuts ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="hidden gap-1.5 sm:flex"
          >
            <Keyboard className="h-3.5 w-3.5" />
            Shortcuts
          </Button>
          <Button variant="outline" size="sm" onClick={resetFlashcards} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts panel */}
      {showShortcuts && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-2 p-4 text-xs sm:grid-cols-4">
            {[
              ["Space / F", "Flip card"],
              ["Arrow keys", "Prev/Next"],
              ["1-4", "Rate confidence"],
              ["S", "Shuffle"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold">{key}</kbd>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Session stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <div>
            <p className="text-lg font-bold tabular-nums">{sessionReviewed}</p>
            <p className="text-[10px] text-muted-foreground">Reviewed</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <Flame className="h-4 w-4 text-amber-500" />
          <div>
            <p className="text-lg font-bold tabular-nums">
              {sessionReviewed > 0 ? Math.round((sessionCorrect / sessionReviewed) * 100) : 0}%
            </p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <Timer className="h-4 w-4 text-info" />
          <div>
            <p className="text-lg font-bold tabular-nums">{minutes}:{String(seconds).padStart(2, "0")}</p>
            <p className="text-[10px] text-muted-foreground">Session</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">M</div>
          <div>
            <p className="text-lg font-bold tabular-nums">{masteredCount}/{allCards.length}</p>
            <p className="text-[10px] text-muted-foreground">Mastered</p>
          </div>
        </div>
      </div>

      {/* Mastery distribution bar */}
      <div className="space-y-2">
        <div className="flex h-3 overflow-hidden rounded-full bg-muted">
          {masteryOrder.map((level) => {
            const count = masteryDist[level];
            const pct = allCards.length > 0 ? (count / allCards.length) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={level}
                className={cn("transition-all duration-500", masteryColorMap[level])}
                style={{ width: `${pct}%` }}
                title={`${level}: ${count}`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 text-[10px]">
          {masteryOrder.map((level) => (
            <div key={level} className="flex items-center gap-1">
              <div className={cn("h-2 w-2 rounded-full", masteryColorMap[level])} />
              <span className="capitalize text-muted-foreground">{level}</span>
              <span className="font-semibold tabular-nums">{masteryDist[level]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category filters + hide known toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedCategory(null); setCurrentIndex(0); setFlipped(false); }}
        >
          All ({allCards.length})
        </Button>
        {categories.map((cat) => {
          const catCount = allCards.filter((c) => c.category === cat).length;
          return (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); setFlipped(false); }}
            >
              {cat} ({catCount})
            </Button>
          );
        })}

        <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />

        <Button
          variant={hideKnown ? "secondary" : "ghost"}
          size="sm"
          onClick={() => { setHideKnown(!hideKnown); setCurrentIndex(0); setFlipped(false); }}
          className="gap-1.5"
        >
          {hideKnown ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {hideKnown ? "Known hidden" : "Hide known"}
        </Button>
      </div>

      {/* Flashcard + controls */}
      <div className="mx-auto max-w-lg space-y-4 pb-8">
        <Flashcard
          front={current.front}
          back={current.back}
          flipped={flipped}
          onFlip={() => setFlipped(!flipped)}
          mastery={currentStatus?.masteryLevel ?? "new"}
          streak={currentStatus?.streak ?? 0}
          cardNumber={currentIndex + 1}
          totalCards={cards.length}
        />

        {/* Confidence rating - shown when flipped */}
        {flipped ? (
          <div>
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-2">
              {confidenceConfig.map(({ level, label, shortcut, color, bg }) => (
                <button
                  key={level}
                  onClick={() => handleRate(level)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-sm font-semibold transition-all duration-150",
                    bg,
                    color
                  )}
                >
                  {label}
                  <kbd className="hidden rounded bg-black/5 px-1.5 py-0.5 font-mono text-[10px] font-medium sm:block">
                    {shortcut}
                  </kbd>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Navigation - shown when not flipped */
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={goPrev} aria-label="Previous" className="h-10 w-10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shuffleCards} aria-label="Shuffle" className="h-10 w-10">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goNext} aria-label="Next" className="h-10 w-10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
