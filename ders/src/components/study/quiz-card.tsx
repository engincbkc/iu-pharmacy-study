import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { QuizQuestion } from "@/types";

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  onAnswer: (answerId: string) => void;
}

export function QuizCard({ question, selectedAnswer, showResult, onAnswer }: QuizCardProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold leading-7 text-[#1a1a2e] sm:text-lg">{question.question}</p>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {question.difficulty}
        </Badge>
      </div>

      <div className="space-y-2">
        {question.options.map((option) => {
          const isCorrect = option.id === question.correctAnswer;
          const isSelected = option.id === selectedAnswer;

          return (
            <button
              key={option.id}
              type="button"
              disabled={showResult}
              onClick={() => onAnswer(option.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-all duration-150",
                !showResult && !isSelected && "border-border bg-card hover:border-primary/30 hover:bg-primary/5",
                !showResult && isSelected && "border-primary bg-primary/5 shadow-sm",
                showResult && isCorrect && "border-emerald-400 bg-emerald-50",
                showResult && isSelected && !isCorrect && "border-red-400 bg-red-50",
                showResult && !isCorrect && !isSelected && "border-border bg-card opacity-60",
                !showResult && "cursor-pointer",
                showResult && "cursor-default"
              )}
            >
              {/* Radio indicator */}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  !showResult && !isSelected && "border-muted-foreground/30 text-muted-foreground",
                  !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                  showResult && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white"
                )}
              >
                {showResult && isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : showResult && isSelected && !isCorrect ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  option.id
                )}
              </span>

              <span className={cn(
                "leading-relaxed",
                showResult && isCorrect && "font-semibold text-emerald-800",
                showResult && isSelected && !isCorrect && "text-red-800 line-through"
              )}>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div
          className={cn(
            "rounded-xl border-2 p-4",
            selectedAnswer === question.correctAnswer
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            {selectedAnswer === question.correctAnswer ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <p className={cn(
              "text-sm font-bold",
              selectedAnswer === question.correctAnswer ? "text-emerald-700" : "text-red-700"
            )}>
              {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[#1a1a2e]/80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
