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
      {/* Mastery indicator */}
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

      {/* 3D flip container - fixed height, perspective on parent */}
      <div className="h-[280px] w-full sm:h-[300px]" style={{ perspective: "1200px" }}>
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0.2,0.2,1)]",
            "[transform-style:preserve-3d]",
            isFlipped && "[transform:rotateY(180deg)]"
          )}
        >
          {/* Front face */}
          <div className="absolute inset-0 flex flex-col rounded-2xl bg-primary text-primary-foreground shadow-lg [backface-visibility:hidden]">
            <span className="absolute left-4 top-4 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Question
            </span>
            <div className="flex flex-1 items-center justify-center px-6 pb-10 pt-14 sm:px-10">
              <p className="max-w-prose text-center text-base font-semibold leading-7 sm:text-lg sm:leading-8">
                {front}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 pb-4 text-[11px] text-white/30">
              <RotateCw className="h-3 w-3" />
              Tap to reveal
              <kbd className="ml-0.5 hidden rounded border border-white/15 bg-white/10 px-1 py-px font-mono text-[9px] sm:inline">
                Space
              </kbd>
            </div>
          </div>

          {/* Back face */}
          <div className="absolute inset-0 flex flex-col rounded-2xl border-2 border-primary/15 bg-card shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="absolute left-4 top-4 z-10 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Answer
            </span>
            <div className="flex flex-1 items-start overflow-y-auto px-6 pb-10 pt-14 sm:px-10">
              <p className="mx-auto max-w-prose text-center text-sm leading-7 text-foreground sm:text-base sm:leading-8">
                {back}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
