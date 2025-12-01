// React import not needed in React 17+
import { HashRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import QuestionsPage from "./pages/QuestionsPage";
import ResultPage from "./pages/ResultPage";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/result" element={<ResultPage />} />
        {/* Alias for parent entry */}
        <Route path="/diagnose" element={<QuestionsPage />} /> 
      </Routes>
    </HashRouter>
  );
};

export default App;