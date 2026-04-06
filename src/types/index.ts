// Topic types
export interface Topic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: TopicSection[];
  keyPoints: string[];
  relatedDrugs: string[];
}

export interface TopicSection {
  heading: string;
  body: string;
  type?: "text" | "list" | "table" | "formula";
  items?: string[];
  tableData?: { headers: string[]; rows: string[][] };
}

// Flashcard types
export interface Flashcard {
  id: string;
  category: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
}

// Quiz types
export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizOption {
  id: string;
  text: string;
}

// Exam question types
export interface ExamYear {
  year: string;
  midterm: ExamQuestion[];
  final: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  type: "multiple-choice" | "open-ended";
  topic: string;
  question: string;
  answer: ExamAnswer;
  options?: string[];
  correctAnswer?: string;
}

export interface ExamAnswer {
  text?: string;
  iupacName?: string;
  chemicalFormula?: string;
  uses?: string[];
  moa?: string;
  synthesis?: SynthesisStep[];
  keyPoints?: string[];
  explanation?: string;
}

export interface SynthesisStep {
  step: number;
  description: string;
  reagents?: string;
}

// SAR types
export interface SARTable {
  id: string;
  drugClass: string;
  description: string;
  baseStructure: string;
  modifications: SARModification[];
  clinicalExamples: SARExample[];
}

export interface SARModification {
  position: string;
  group: string;
  effect: string;
}

export interface SARExample {
  drug: string;
  modification: string;
  result: string;
}

// Formula types
export interface Formula {
  id: string;
  name: string;
  category: string;
  equation: string;
  variables: FormulaVariable[];
  description: string;
  example?: string;
  clinicalUse: string;
}

export interface FormulaVariable {
  symbol: string;
  meaning: string;
}

// Drug types
export interface Drug {
  id: string;
  genericName: string;
  brandNames: string[];
  iupacName: string;
  chemicalFormula: string;
  drugClass: string;
  moa: string;
  uses: string[];
  sarPoints: string[];
  synthesis?: SynthesisStep[];
}

// Molecule types (React Flow)
export interface MoleculeData {
  id: string;
  name: string;
  description: string;
  nodes: MoleculeNode[];
  edges: MoleculeEdge[];
  sarAnnotations?: SARAnnotation[];
}

export interface MoleculeNode {
  id: string;
  type: "atom" | "functional-group" | "bond-label";
  position: { x: number; y: number };
  data: { label: string; element?: string; charge?: string };
}

export interface MoleculeEdge {
  id: string;
  source: string;
  target: string;
  type?: "single" | "double" | "triple";
  label?: string;
}

export interface SARAnnotation {
  nodeId: string;
  text: string;
  effect: string;
}

// Progress types
export interface StudyProgress {
  completedTopics: string[];
  flashcardProgress: Record<string, FlashcardStatus>;
  quizScores: QuizScore[];
  examProgress: Record<string, boolean>;
  lastStudied: string | null;
}

export type ConfidenceLevel = "again" | "hard" | "good" | "easy";

export type MasteryLevel = "new" | "learning" | "reviewing" | "familiar" | "mastered";

export interface FlashcardStatus {
  known: boolean;
  confidence: ConfidenceLevel;
  masteryLevel: MasteryLevel;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  lastReviewed: string;
}

export interface QuizScore {
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  topics: string[];
  wrongQuestionIds: string[];
}

// Navigation
export interface NavItem {
  label: string;
  labelKey: string;
  path: string;
  icon: string;
}
