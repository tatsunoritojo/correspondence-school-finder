// React import not needed in React 17+
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";

const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-orange-50/30">
    <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/r/:token" element={<ResultPage />} />
          {/* Alias for parent entry */}
          <Route path="/diagnose" element={<QuestionsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;