import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { QUESTIONS } from '../data/questions';
import { Answers, AnswerValue, AxisId, Role } from '../types';
import { calculateScores } from '../lib/scoring';
import { saveChildResult, saveLocalProgress } from '../lib/storage';

export const QuestionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = (searchParams.get('role') as Role) || 'child';

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [knockoutAxis, setKnockoutAxis] = useState<AxisId | null>(null);

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
        const scores = calculateScores(answers, QUESTIONS, knockoutAxis);
        const result = {
            role,
            answers,
            knockoutAxis,
            scores,
            timestamp: Date.now()
        };

        // Save logic
        if (role === 'child') {
            saveChildResult(result);
            saveLocalProgress(result); // Save as "my result"
        } else {
            // For parent flow started from start page, just save as local progress
            saveLocalProgress(result);
        }

        navigate('/result');
    };

    // Get current answer value for the card
    const getCurrentAnswer = () => {
        if (currentQuestion.type === 'knockout') return knockoutAxis || undefined;
        return answers[currentQuestion.id];
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
            {/* Progress Bar */}
            <div className="w-full max-w-md mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Question {currentQuestionIndex + 1}</span>
                    <span>{QUESTIONS.length}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
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
