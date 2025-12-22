import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocalStorageRepository } from "../lib/storage";
import { calculateScores } from "../lib/scoring";
import { DiagnosisResult, AnswerMap, AxisId } from "../types";
import { QUESTIONS, AXES } from "../data/constants";
import { ChevronRight, Check, ChevronLeft } from "lucide-react";

const QuestionsPage = () => {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") as "child" | "parent") || "child";
  const childIdParam = searchParams.get("child_id");

  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  // Sort: Knockout first
  const sortedQuestions = [
    ...QUESTIONS.filter(q => q.type === "knockout"),
    ...QUESTIONS.filter(q => q.type === "normal")
  ];

  const currentQ = sortedQuestions[currentIdx];
  const progress = ((currentIdx + 1) / sortedQuestions.length) * 100;

  const handleAnswer = (val: number | string) => {
    // Store answer only, no auto advance
    const newAnswers = { ...answers, [currentQ.id]: val as any };
    setAnswers(newAnswers);
  };

  const handleChoiceAnswer = (val: string, isMulti: boolean) => {
    if (isMulti) {
      const currentVal = (answers[currentQ.id] as unknown as string[]) || [];
      let newVal: string[];
      if (currentVal.includes(val)) {
        newVal = currentVal.filter(v => v !== val);
      } else {
        newVal = [...currentVal, val];
      }
      setAnswers({ ...answers, [currentQ.id]: newVal as any });
    } else {
      setAnswers({ ...answers, [currentQ.id]: val as any });
    }
  };

  const toggleKnockoutAnswer = (axisId: AxisId) => {
    const currentVal = (answers[currentQ.id] as unknown as AxisId[]) || [];
    let newVal: AxisId[];

    if (currentVal.includes(axisId)) {
      newVal = currentVal.filter(id => id !== axisId);
    } else {
      if (currentVal.length >= 5) return; // Max 5
      newVal = [...currentVal, axisId];
    }

    setAnswers({ ...answers, [currentQ.id]: newVal as any });
  };

  const handleNext = async () => {
    // General next handler for all types
    if (currentIdx < sortedQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      window.scrollTo(0, 0);
    } else {
      await finishDiagnosis(answers);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      // If at first question, go back to start page
      navigate("/");
    }
  };

  const finishDiagnosis = async (finalAnswers: AnswerMap) => {
    // Extract Knockout Axis
    const knockoutQ = QUESTIONS.find(q => q.type === "knockout");
    // The value stored for knockout is the AxisId[]
    const knockoutAnswers = (finalAnswers[knockoutQ!.id] as unknown as AxisId[]) || [];

    const scores = calculateScores(finalAnswers, knockoutAnswers);

    // Create Result Object
    const result: DiagnosisResult = {
      role,
      answers: finalAnswers,
      knockoutAnswers,
      scores,
      timestamp: Date.now()
    };

    // ID Logic
    const childId = childIdParam || crypto.randomUUID();

    // Save
    await LocalStorageRepository.saveResult(childId, result);

    // Navigate
    navigate(`/result?child_id=${childId}&role=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50/30 relative">
      {/* Fixed Header with Blur Background */}
      <div className="fixed top-0 left-0 w-full z-20 bg-orange-50/95 backdrop-blur-md border-b border-orange-100/50 shadow-sm transition-all">
        <div className="max-w-xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-orange-100 text-stone-500 hover:text-orange-600 transition-colors"
              aria-label="戻る"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-xs font-bold text-stone-400 tracking-wider">
              QUESTION {currentIdx + 1} / {sortedQuestions.length}
            </div>
            <div className="w-8" /> {/* Spacer for center alignment */}
          </div>

          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(251,146,60,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content with top padding to avoid header overlap */}
      <div className="w-full max-w-xl animate-fade-in-up px-6 pb-10 pt-32">
        {/* Question Card */}
        <div className="glass-card p-8 md:p-10 rounded-[2rem] shadow-xl border-white/60 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 pointer-events-none"></div>

          <span className="relative inline-block px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold tracking-wider rounded-full mb-6">
            {currentQ.type === "knockout" ? "一番たいせつなこと" : `Q${currentIdx}`}
          </span>

          <h2 className="relative text-xl md:text-2xl font-bold text-stone-700 mb-10 leading-relaxed">
            {currentQ.text}
          </h2>

          <div className="relative flex flex-col gap-3 z-10">
            {/* Parent Mode Clarification */}
            {role === 'parent' && currentQ.id === 'Q1-1' && (
              <div className="mb-2 p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-sm font-bold flex items-center gap-2">
                <Check size={16} />
                ※お子様の状況についてお答えください
              </div>
            )}

            {currentQ.type === "knockout" ? (
              // Knockout Options (Axes)
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                  {AXES.map(axis => {
                    const selectedIds = (answers[currentQ.id] as unknown as AxisId[]) || [];
                    const isSelected = selectedIds.includes(axis.id);

                    return (
                      <button
                        key={axis.id}
                        onClick={() => toggleKnockoutAnswer(axis.id)}
                        className={`text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group active:scale-[0.98]
                                    ${isSelected
                            ? "border-orange-500 bg-orange-50 shadow-md"
                            : "border-stone-100 bg-white/60 hover:border-orange-300 hover:bg-orange-50/50"
                          }
                                `}
                      >
                        <span className={`font-medium ${isSelected ? "text-orange-700" : "text-stone-700"}`}>
                          {axis.shortDescription}
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${isSelected
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-stone-300 text-transparent group-hover:border-orange-400"
                          }
                                `}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleNext}
                    disabled={!answers[currentQ.id] || (answers[currentQ.id] as unknown as AxisId[]).length === 0}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    次へ進む
                    <ChevronRight size={18} />
                  </button>
                </div>
                <p className="text-center text-xs text-stone-400">
                  1つ以上、5つまで選択できます
                </p>
              </div>
            ) : currentQ.type === "single_choice" || currentQ.type === "multi_choice" ? (
              // Choice Options (New Types)
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options?.map((opt) => {
                    const currentVal = answers[currentQ.id];
                    let isSelected = false;

                    if (currentQ.type === 'single_choice') {
                      isSelected = currentVal === opt.value;
                    } else {
                      isSelected = Array.isArray(currentVal) && currentVal.includes(opt.value);
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleChoiceAnswer(opt.value, currentQ.type === 'multi_choice')}
                        className={`text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group active:scale-[0.98]
                                                ${isSelected
                            ? "border-orange-500 bg-orange-50 shadow-md"
                            : "border-stone-100 bg-white/60 hover:border-orange-300 hover:bg-orange-50/50"
                          }
                                            `}
                      >
                        <span className={`font-medium ${isSelected ? "text-orange-700" : "text-stone-700"}`}>
                          {opt.label}
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                                ${isSelected
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-stone-300 text-transparent group-hover:border-orange-400"
                          }
                                            `}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleNext}
                    disabled={!answers[currentQ.id] || (Array.isArray(answers[currentQ.id]) && (answers[currentQ.id] as string[]).length === 0)}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    次へ進む
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // Likert Scale Options
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  {[
                    { val: 5, label: "とてもそう思う" },
                    { val: 4, label: "そう思う" },
                    { val: 3, label: "どちらともいえない" },
                    { val: 2, label: "あまりそう思わない" },
                    { val: 1, label: "全くそう思わない" }
                  ].map(opt => {
                    const isSelected = answers[currentQ.id] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => handleAnswer(opt.val)}
                        className={`group relative w-full text-left px-6 py-4 rounded-xl border border-stone-200 transition-all duration-200 active:scale-[0.98]
                            ${isSelected
                            ? "bg-orange-100 border-orange-500 shadow-inner"
                            : "bg-white/60 hover:border-orange-400 hover:bg-orange-50/90"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isSelected ? "text-orange-900 font-bold" : "text-stone-700 group-hover:text-orange-900"}`}>
                            {opt.label}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                ${isSelected
                              ? "border-orange-500 bg-orange-500"
                              : "border-stone-300 group-hover:border-orange-500 group-hover:bg-orange-500"
                            }
                            `}>
                            <Check className={`w-3 h-3 text-white ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleNext}
                    disabled={!answers[currentQ.id]}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    次へ進む
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuestionsPage;