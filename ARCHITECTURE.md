# Pharmaceutical Chemistry Study Platform - Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build Tool | Vite | 6.x |
| Language | TypeScript | 5.x |
| UI Components | shadcn/ui | latest (New York style) |
| Styling | Tailwind CSS | 4.x |
| Molecular Diagrams | React Flow | 12.x |
| Routing | React Router | 7.x (single-page with hash routes) |
| State Management | Zustand | 5.x |
| i18n | Custom lightweight (JSON-based) |
| Icons | Lucide React |

## Project Structure

```
src/
├── app.tsx                    # Root component with routing
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind
│
├── components/
│   ├── ui/                    # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   ├── header.tsx         # Top bar with search + language toggle
│   │   └── shell.tsx          # Main layout shell
│   ├── study/
│   │   ├── topic-card.tsx     # Expandable topic card
│   │   ├── flashcard.tsx      # Flip flashcard component
│   │   ├── quiz-card.tsx      # Single quiz question
│   │   ├── quiz-session.tsx   # Full quiz session with scoring
│   │   ├── sar-table.tsx      # SAR comparison table
│   │   ├── formula-display.tsx # Formula/equation renderer
│   │   └── drug-info.tsx      # Drug detail card
│   └── molecules/
│       ├── molecule-viewer.tsx # React Flow based molecule diagram
│       └── molecule-nodes.tsx  # Custom React Flow node types
│
├── pages/
│   ├── dashboard.tsx          # Home/overview with progress
│   ├── topics.tsx             # Study topics (konular)
│   ├── flashcards.tsx         # Flashcard study mode
│   ├── quiz.tsx               # Quiz/test mode
│   ├── exam-questions.tsx     # Past exam questions (cikmis sorular)
│   ├── sar-reference.tsx      # SAR tables reference
│   └── formulas.tsx           # Important formulas
│
├── data/
│   ├── topics.json            # All study topics content
│   ├── flashcards.json        # Flashcard Q&A pairs
│   ├── quiz-questions.json    # Quiz questions with options
│   ├── exam-questions.json    # Past exam questions (2021-2025)
│   ├── sar-tables.json        # SAR data for all drug classes
│   ├── formulas.json          # Formulas and equations
│   ├── drugs.json             # Drug database (name, structure, MOA, etc.)
│   └── molecules.json         # React Flow node/edge data for molecules
│
├── i18n/
│   ├── en.json                # English translations
│   ├── tr.json                # Turkish translations
│   └── use-i18n.ts            # i18n hook
│
├── stores/
│   ├── progress-store.ts      # Study progress (persisted to localStorage)
│   └── settings-store.ts      # Language, theme preferences
│
├── lib/
│   ├── utils.ts               # shadcn/ui cn() utility
│   └── constants.ts           # App constants
│
└── types/
    └── index.ts               # Shared TypeScript interfaces
```

## Data Flow

```
JSON Data Files (static, versioned)
        │
        ▼
  Zustand Stores (runtime state + localStorage persistence)
        │
        ▼
  Pages (data consumers, layout)
        │
        ▼
  Components (pure UI, receive props)
```

## Key Architectural Decisions

1. **Static JSON for content**: All pharmaceutical content lives in typed JSON files. No backend needed. Easy to review, version, and update.

2. **Single-page app**: React Router with hash-based routes. No server-side rendering needed for a study tool.

3. **Progress persistence**: Zustand with localStorage middleware tracks completed topics, quiz scores, flashcard progress.

4. **React Flow for molecules**: Custom node types render atoms, bonds, and functional groups. Edge labels show bond types. This provides interactive, zoomable molecular structure diagrams.

5. **i18n without heavy libraries**: A simple `useI18n()` hook that reads from JSON translation files. The pharmaceutical content itself is in English (as per user's study language) with UI chrome available in both TR/EN.

6. **shadcn/ui New York style**: Clean, professional look without gradients or decorative emojis. Uses the Zinc color palette for a medical/scientific feel.

## Pages Overview

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/` | Progress overview, quick stats, recent activity |
| Topics | `/topics` | Expandable study topics with detailed notes |
| Flashcards | `/flashcards` | Interactive flip cards for memorization |
| Quiz | `/quiz` | Test mode with immediate feedback |
| Exam Questions | `/exams` | Past exam questions (2021-2025) with solutions |
| SAR Reference | `/sar` | Structure-Activity Relationship tables |
| Formulas | `/formulas` | Key equations (Henderson-Hasselbalch, Hansch, etc.) |
