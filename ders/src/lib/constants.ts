export const APP_NAME = "PharmChem Study";
export const APP_VERSION = "1.0.0";

export const MAX_QUIZ_QUESTIONS = 20;
export const FLASHCARD_CATEGORIES = [
  "Drug-Receptor Concepts",
  "SAR Rules",
  "Drug Classifications",
  "Mechanisms of Action",
  "Key Formulas",
  "Drug Names & IUPAC",
  "Metabolism",
] as const;

export const EXAM_YEARS = [
  "2024-2025",
  "2021-2022",
] as const;

export const NAV_ITEMS = [
  { label: "Dashboard", labelKey: "nav.dashboard", path: "/", icon: "LayoutDashboard" },
  { label: "Topics", labelKey: "nav.topics", path: "/topics", icon: "BookOpen" },
  { label: "Flashcards", labelKey: "nav.flashcards", path: "/flashcards", icon: "Layers" },
  { label: "Quiz", labelKey: "nav.quiz", path: "/quiz", icon: "CircleHelp" },
  { label: "Exam Questions", labelKey: "nav.exams", path: "/exams", icon: "FileText" },
  { label: "SAR Reference", labelKey: "nav.sar", path: "/sar", icon: "FlaskConical" },
  { label: "Formulas", labelKey: "nav.formulas", path: "/formulas", icon: "Calculator" },
] as const;

export const STORAGE_KEYS = {
  PROGRESS: "pharmchem-progress",
  SETTINGS: "pharmchem-settings",
} as const;
