import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Shell } from "@/components/layout/shell";

const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage }))
);
const TopicsPage = lazy(() =>
  import("@/pages/topics").then((m) => ({ default: m.TopicsPage }))
);
const FlashcardsPage = lazy(() =>
  import("@/pages/flashcards").then((m) => ({ default: m.FlashcardsPage }))
);
const QuizPage = lazy(() =>
  import("@/pages/quiz").then((m) => ({ default: m.QuizPage }))
);
const ExamQuestionsPage = lazy(() =>
  import("@/pages/exam-questions").then((m) => ({
    default: m.ExamQuestionsPage,
  }))
);
const SARReferencePage = lazy(() =>
  import("@/pages/sar-reference").then((m) => ({
    default: m.SARReferencePage,
  }))
);
const FormulasPage = lazy(() =>
  import("@/pages/formulas").then((m) => ({ default: m.FormulasPage }))
);

function PageLoader() {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="topics"
            element={
              <Suspense fallback={<PageLoader />}>
                <TopicsPage />
              </Suspense>
            }
          />
          <Route
            path="flashcards"
            element={
              <Suspense fallback={<PageLoader />}>
                <FlashcardsPage />
              </Suspense>
            }
          />
          <Route
            path="quiz"
            element={
              <Suspense fallback={<PageLoader />}>
                <QuizPage />
              </Suspense>
            }
          />
          <Route
            path="exams"
            element={
              <Suspense fallback={<PageLoader />}>
                <ExamQuestionsPage />
              </Suspense>
            }
          />
          <Route
            path="sar"
            element={
              <Suspense fallback={<PageLoader />}>
                <SARReferencePage />
              </Suspense>
            }
          />
          <Route
            path="formulas"
            element={
              <Suspense fallback={<PageLoader />}>
                <FormulasPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}
