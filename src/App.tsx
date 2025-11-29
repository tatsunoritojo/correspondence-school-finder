import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { ResultPage } from './pages/ResultPage';
import { DiagnosePage } from './pages/DiagnosePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/questions" element={<QuestionsPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/diagnose" element={<DiagnosePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
