import React from 'react';
import { Question, AnswerValue, AxisId } from '../types';
import { AXES } from '../data/axes';
import { clsx } from 'clsx';

interface QuestionCardProps {
    question: Question;
    currentAnswer: AnswerValue | AxisId | undefined;
    onAnswer: (value: AnswerValue | AxisId) => void;
    onNext: () => void;
    onBack: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    currentAnswer,
    onAnswer,
    onNext,
    onBack,
    isFirst,
    isLast,
}) => {
    const isKnockout = question.type === 'knockout';

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto animate-fade-in">
            <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                    {isKnockout ? '最重要' : question.id}
                </span>
                <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
                    {question.text}
                </h2>
            </div>

            <div className="space-y-3 mb-8">
                {isKnockout ? (
                    <div className="grid grid-cols-1 gap-2">
                        {AXES.map((axis) => (
                            <button
                                key={axis.id}
                                onClick={() => onAnswer(axis.id)}
                                className={clsx(
                                    "p-4 text-left rounded-xl border-2 transition-all",
                                    currentAnswer === axis.id
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                )}
                            >
                                <div className="font-bold">{axis.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{axis.definition}</div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col space-y-3">
                        {[5, 4, 3, 2, 1].map((val) => (
                            <button
                                key={val}
                                onClick={() => {
                                    onAnswer(val as AnswerValue);
                                    // Small delay to show visual feedback before transition
                                    setTimeout(() => {
                                        onNext();
                                    }, 250);
                                }}
                                className={clsx(
                                    "p-4 text-left rounded-xl border-2 transition-all flex items-center",
                                    currentAnswer === val
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                )}
                            >
                                <div className={clsx(
                                    "w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center",
                                    currentAnswer === val ? "border-blue-500" : "border-gray-300"
                                )}>
                                    {currentAnswer === val && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                </div>
                                <span className="font-medium">
                                    {val === 5 && "とてもそう思う"}
                                    {val === 4 && "そう思う"}
                                    {val === 3 && "どちらともいえない"}
                                    {val === 2 && "あまりそう思わない"}
                                    {val === 1 && "まったくそう思わない"}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={onBack}
                    disabled={isFirst}
                    className={clsx(
                        "px-6 py-2 rounded-lg font-medium transition-colors",
                        isFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    )}
                >
                    戻る
                </button>
                {isKnockout && (
                    <button
                        onClick={onNext}
                        disabled={!currentAnswer}
                        className={clsx(
                            "px-8 py-2 rounded-lg font-bold text-white transition-all shadow-md",
                            !currentAnswer
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                        )}
                    >
                        次へ
                    </button>
                )}
            </div>
        </div>
    );
};
