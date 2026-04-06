# Pharmaceutical Chemistry Study Platform - Coding Standards

## General Principles

- **Reusable, modular components**: Every component should do one thing well. Compose complex UIs from small, focused pieces.
- **Props over internal state**: Components receive data via props. State lives in stores or page-level components.
- **Colocation**: Keep related files together. A component's types, tests, and styles live near the component.
- **No premature abstraction**: Don't create a wrapper until you need it in 3+ places.

## TypeScript

- Strict mode enabled (`"strict": true`)
- Use `interface` for component props, `type` for unions and utilities
- Export types from `src/types/index.ts` for shared interfaces
- No `any` - use `unknown` + type guards when needed
- Prefer `as const` for literal types

```typescript
// Good
interface QuizQuestionProps {
  question: Question;
  onAnswer: (answerId: string) => void;
  showExplanation: boolean;
}

// Bad - avoid inline types for reusable shapes
const QuizCard = ({ q }: { q: any }) => ...
```

## Component Patterns

### File naming
- Components: `kebab-case.tsx` (e.g., `quiz-card.tsx`)
- Stores: `kebab-case.ts` (e.g., `progress-store.ts`)
- Types: `index.ts` in `types/` folder
- Data: `kebab-case.json`

### Component structure
```typescript
// 1. Imports (external, then internal, then types)
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Question } from "@/types";

// 2. Props interface (co-located, not in types/ unless shared)
interface QuizCardProps {
  question: Question;
  onAnswer: (id: string) => void;
}

// 3. Component (named export, not default)
export function QuizCard({ question, onAnswer }: QuizCardProps) {
  // hooks first
  const [selected, setSelected] = useState<string | null>(null);

  // handlers
  const handleSelect = (id: string) => {
    setSelected(id);
    onAnswer(id);
  };

  // render
  return (
    <Card>
      <CardHeader>{question.text}</CardHeader>
      <CardContent>
        {question.options.map((opt) => (
          <button key={opt.id} onClick={() => handleSelect(opt.id)}>
            {opt.text}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
```

### Composition over configuration
```typescript
// Good - composable
<Card>
  <CardHeader>
    <Badge variant="destructive">Exam 2024</Badge>
    <CardTitle>Carbachol</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

// Bad - too many props
<DrugCard
  badge="Exam 2024"
  badgeVariant="destructive"
  title="Carbachol"
  content={...}
/>
```

## State Management (Zustand)

- One store per domain: `progress-store`, `settings-store`
- Use slices for organization within a store
- Persist to localStorage with Zustand persist middleware
- Use selectors to prevent unnecessary re-renders

```typescript
// Good - selective subscription
const score = useProgressStore((s) => s.quizScore);

// Bad - subscribes to entire store
const store = useProgressStore();
```

## Data Files (JSON)

- All pharmaceutical content in `src/data/*.json`
- TypeScript types match JSON shape exactly
- Content is in English (study language)
- UI labels/chrome in both TR/EN via i18n system
- Validate data shape at build time with TypeScript imports

## Styling

- Tailwind CSS utility classes only (no custom CSS except for animations)
- Use `cn()` utility for conditional classes
- No inline styles
- No CSS modules
- Follow shadcn/ui patterns for component styling
- Use CSS custom properties from design system for semantic colors

```typescript
// Good
<div className={cn("rounded-lg border p-4", isCorrect && "border-green-500")}>

// Bad
<div style={{ borderRadius: 8, border: isCorrect ? '1px solid green' : '1px solid gray' }}>
```

## i18n

- `useI18n()` hook returns `t()` function
- Translation keys are dot-separated: `nav.topics`, `quiz.checkAnswer`
- Pharmaceutical content stays in English (not translated)
- Only UI chrome/labels are bilingual

```typescript
const { t } = useI18n();
return <Button>{t("quiz.submit")}</Button>;
```

## File Organization Rules

1. **Pages** import from **components** and **stores**
2. **Components** never import from **pages**
3. **Stores** never import from **components** or **pages**
4. **Data** is imported by **pages** or **stores** only
5. **Types** can be imported by anything
6. **UI components** (shadcn) are leaf nodes - they import nothing from the app

## Performance

- Lazy load pages with `React.lazy()` + `Suspense`
- Memoize expensive computations (filtering large question sets)
- Use `React.memo` only when profiling shows a need
- Keep React Flow instances unmounted when not visible (tab switching)

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `QuizCard` |
| File | kebab-case | `quiz-card.tsx` |
| Hook | camelCase with `use` prefix | `useI18n` |
| Store | camelCase with `Store` suffix | `progressStore` |
| Type/Interface | PascalCase | `QuizQuestion` |
| Constant | SCREAMING_SNAKE | `MAX_QUIZ_QUESTIONS` |
| CSS variable | kebab-case with `--` prefix | `--success` |
