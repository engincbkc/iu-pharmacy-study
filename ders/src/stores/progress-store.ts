import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";
import type { FlashcardStatus, QuizScore, ConfidenceLevel, MasteryLevel } from "@/types";

function getNextMastery(current: MasteryLevel, confidence: ConfidenceLevel): MasteryLevel {
  const levels: MasteryLevel[] = ["new", "learning", "reviewing", "familiar", "mastered"];
  const idx = levels.indexOf(current);

  if (confidence === "again") return "learning";
  if (confidence === "hard") return levels[Math.max(0, idx - 1)] as MasteryLevel;
  if (confidence === "good") return levels[Math.min(levels.length - 1, idx + 1)] as MasteryLevel;
  if (confidence === "easy") return levels[Math.min(levels.length - 1, idx + 2)] as MasteryLevel;
  return current;
}

interface ProgressState {
  completedTopics: string[];
  flashcardProgress: Record<string, FlashcardStatus>;
  quizScores: QuizScore[];
  examProgress: Record<string, boolean>;
  lastStudied: string | null;
  studyStreak: number;
  lastStudyDate: string | null;

  toggleTopic: (topicId: string) => void;
  rateFlashcard: (cardId: string, confidence: ConfidenceLevel) => void;
  markFlashcard: (cardId: string, known: boolean) => void;
  resetFlashcards: () => void;
  addQuizScore: (score: QuizScore) => void;
  toggleExamQuestion: (questionId: string) => void;
  updateStreak: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedTopics: [],
      flashcardProgress: {},
      quizScores: [],
      examProgress: {},
      lastStudied: null,
      studyStreak: 0,
      lastStudyDate: null,

      toggleTopic: (topicId) =>
        set((s) => ({
          completedTopics: s.completedTopics.includes(topicId)
            ? s.completedTopics.filter((id) => id !== topicId)
            : [...s.completedTopics, topicId],
          lastStudied: new Date().toISOString(),
        })),

      rateFlashcard: (cardId, confidence) =>
        set((s) => {
          const prev = s.flashcardProgress[cardId];
          const isCorrect = confidence === "good" || confidence === "easy";
          const currentMastery: MasteryLevel = prev?.masteryLevel ?? "new";
          const newMastery = getNextMastery(currentMastery, confidence);

          return {
            flashcardProgress: {
              ...s.flashcardProgress,
              [cardId]: {
                known: newMastery === "mastered" || newMastery === "familiar",
                confidence,
                masteryLevel: newMastery,
                reviewCount: (prev?.reviewCount ?? 0) + 1,
                correctCount: (prev?.correctCount ?? 0) + (isCorrect ? 1 : 0),
                incorrectCount: (prev?.incorrectCount ?? 0) + (isCorrect ? 0 : 1),
                streak: isCorrect ? (prev?.streak ?? 0) + 1 : 0,
                lastReviewed: new Date().toISOString(),
              },
            },
            lastStudied: new Date().toISOString(),
          };
        }),

      markFlashcard: (cardId, known) =>
        set((s) => {
          const prev = s.flashcardProgress[cardId];
          return {
            flashcardProgress: {
              ...s.flashcardProgress,
              [cardId]: {
                known,
                confidence: known ? "good" : "again",
                masteryLevel: known ? "familiar" : "learning",
                reviewCount: (prev?.reviewCount ?? 0) + 1,
                correctCount: (prev?.correctCount ?? 0) + (known ? 1 : 0),
                incorrectCount: (prev?.incorrectCount ?? 0) + (known ? 0 : 1),
                streak: known ? (prev?.streak ?? 0) + 1 : 0,
                lastReviewed: new Date().toISOString(),
              },
            },
            lastStudied: new Date().toISOString(),
          };
        }),

      resetFlashcards: () => set({ flashcardProgress: {} }),

      addQuizScore: (score) =>
        set((s) => ({
          quizScores: [...s.quizScores, score],
          lastStudied: new Date().toISOString(),
        })),

      toggleExamQuestion: (questionId) =>
        set((s) => ({
          examProgress: {
            ...s.examProgress,
            [questionId]: !s.examProgress[questionId],
          },
        })),

      updateStreak: () =>
        set((s) => {
          const today = new Date().toDateString();
          const lastDate = s.lastStudyDate;
          if (lastDate === today) return {};

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const isConsecutive = lastDate === yesterday.toDateString();
          return {
            studyStreak: isConsecutive ? s.studyStreak + 1 : 1,
            lastStudyDate: today,
          };
        }),
    }),
    { name: STORAGE_KEYS.PROGRESS }
  )
);
