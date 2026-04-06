import { useState } from "react";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";
import type { MasteryLevel } from "@/types";

const masteryColors: Record<MasteryLevel, string> = {
  new: "bg-zinc-400",
  learning: "bg-red-500",
  reviewing: "bg-amber-500",
  familiar: "bg-blue-500",
  mastered: "bg-emerald-500",
};

const masteryLabels: Record<MasteryLevel, string> = {
  new: "New",
  learning: "Learning",
  reviewing: "Reviewing",
  familiar: "Familiar",
  mastered: "Mastered",
};

interface FlashcardProps {
  front: string;
  back: string;
  flipped?: boolean;
  onFlip?: () => void;
  mastery?: MasteryLevel;
  streak?: number;
  cardNumber?: number;
  totalCards?: number;
}

export function Flashcard({
  front,
  back,
  flipped: controlledFlipped,
  onFlip,
  mastery = "new",
  streak = 0,
  cardNumber,
  totalCards,
}: FlashcardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = controlledFlipped ?? internalFlipped;

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  return (
    <div
      className="group cursor-pointer select-none"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Show question" : "Show answer"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
    >
      {/* Mastery indicator bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", masteryColors[mastery])} />
          <span className="text-xs font-medium text-muted-foreground">{masteryLabels[mastery]}</span>
          {streak > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {streak}x streak
            </span>
          )}
        </div>
        {cardNumber !== undefined && totalCards !== undefined && (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {cardNumber}/{totalCards}
          </span>
        )}
      </div>

      <div className="relative w-full [perspective:1200px]">
        <div
          className={cn(
            "transition-transform duration-500 ease-out [transform-style:preserve-3d]",
            isFlipped && "[transform:rotateY(180deg)]"
          )}
        >
          {/* Front - Question */}
          <div className={cn(
            "flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-primary px-6 py-12 text-white shadow-xl [backface-visibility:hidden] sm:min-h-[320px] sm:px-10",
            isFlipped && "invisible"
          )}>
            <div className="absolute left-4 top-4 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              Question
            </div>
            <p className="text-center text-lg font-semibold leading-8 sm:text-xl">{front}</p>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-white/40">
              <RotateCw className="h-3 w-3" />
              <span>
                Tap to reveal <kbd className="ml-1 hidden rounded border border-white/20 bg-white/10 px-1 py-0.5 font-mono text-[10px] sm:inline">Space</kbd>
              </span>
            </div>
          </div>

          {/* Back - Answer */}
          <div className={cn(
            "absolute inset-0 flex min-h-[280px] flex-col items-center justify-center overflow-y-auto rounded-2xl border-2 border-primary/20 bg-card px-6 py-12 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] sm:min-h-[320px] sm:px-10",
            !isFlipped && "invisible"
          )}>
            <div className="absolute left-4 top-4 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Answer
            </div>
            <p className="max-w-prose text-center text-sm leading-7 text-foreground sm:text-base sm:leading-8">{back}</p>
            <div className="mt-6 shrink-0 flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60">
              <RotateCw className="h-3 w-3" />
              <span>Rate your confidence below</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
