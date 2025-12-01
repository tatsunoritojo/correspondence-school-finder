import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { QUESTIONS } from '../data/questions';
import { Answers, AnswerValue, AxisId, DiagnosticResult } from '../types';
import { calculateScores } from '../lib/scoring';
import { LocalStorageRepository } from '../lib/storage';
import { Loader2 } from 'lucide-react';

export const DiagnosePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const childId = searchParams.get('child_id');

    const [childResult, setChildResult] = useState<DiagnosticResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [knockoutAxis, setKnockoutAxis] = useState<AxisId | null>(null);

    useEffect(() => {
        if (!childId) {
            alert('無効なURLです。');
            navigate('/');
            return;
        }

        LocalStorageRepository.loadData(childId).then(data => {
            if (data.child) {
                setChildResult(data.child);
            } else {
                alert('データが見つかりませんでした。');
                navigate('/');
            }
            setIsLoading(false);
        });
    }, [childId, navigate]);

    if (isLoading || !childResult) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    const handleAnswer = (value: AnswerValue | AxisId) => {
        if (currentQuestion.type === 'knockout') {
            setKnockoutAxis(value as AxisId);
        } else {
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: value as AnswerValue }));
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            finishDiagnosis();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    const finishDiagnosis = () => {
        const scores = calculateScores(answers, knockoutAxis);
        const parentResult: DiagnosticResult = {
            role: 'parent',
            answers,
            knockoutAxis,
            scores,
            timestamp: Date.now()
        };

        navigate('/result', {
            state: {
                result: parentResult,
                childResult: childResult
            }
        });
    };

    const getCurrentAnswer = () => {
        if (currentQuestion.type === 'knockout') return knockoutAxis || undefined;
        return answers[currentQuestion.id];
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center py-8 px-4">
            {/* Header for Parent */}
            <div className="w-full max-w-md mb-6 text-center">
                <h1 className="text-lg font-bold text-green-800">保護者用 診断モード</h1>
                <p className="text-xs text-green-600">お子様の結果と比較するために、保護者の方の考えを回答してください</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Question {currentQuestionIndex + 1}</span>
                    <span>{QUESTIONS.length}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <QuestionCard
                question={currentQuestion}
                currentAnswer={getCurrentAnswer()}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentQuestionIndex === 0}
            />
        </div>
    );
};
