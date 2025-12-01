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

  const handleAnswer = async (val: number | string) => {
    // Store answer
    const newAnswers = { ...answers, [currentQ.id]: val as any };
    setAnswers(newAnswers);

    // Fade out effect could be added here
    if (currentIdx < sortedQuestions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 250);
    } else {
      await finishDiagnosis(newAnswers);
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
    // The value stored for knockout is the AxisId string
    const knockoutAxis = finalAnswers[knockoutQ!.id] as unknown as AxisId;

    const scores = calculateScores(finalAnswers, knockoutAxis);
    
    // Create Result Object
    const result: DiagnosisResult = {
      role,
      answers: finalAnswers,
      knockoutAxis,
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
                    style={{ width: `${progress}%`}}
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
            {currentQ.type === "knockout" ? (
                // Knockout Options (Axes)
                <div className="grid grid-cols-1 gap-3">
                    {AXES.map(axis => (
                    <button
                        key={axis.id}
                        onClick={() => handleAnswer(axis.id)}
                        className="text-left px-6 py-4 rounded-xl border-2 border-stone-100 hover:border-orange-400 hover:bg-orange-50/90 transition-all duration-200 flex justify-between items-center group bg-white/60 active:scale-[0.98]"
                    >
                        <span className="font-medium text-stone-700">{axis.shortDescription}</span>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-orange-500 transition-colors" />
                    </button>
                    ))}
                </div>
            ) : (
                // Likert Scale Options
                [
                { val: 5, label: "とてもそう思う" },
                { val: 4, label: "そう思う" },
                { val: 3, label: "どちらともいえない" },
                { val: 2, label: "あまりそう思わない" },
                { val: 1, label: "全くそう思わない" }
                ].map(opt => (
                <button
                    key={opt.val}
                    onClick={() => handleAnswer(opt.val)}
                    className="group relative w-full text-left px-6 py-4 rounded-xl border border-stone-200 hover:border-orange-400 hover:bg-orange-50/90 transition-all duration-200 bg-white/60 active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-stone-700 font-medium group-hover:text-orange-900">{opt.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 border-stone-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500 transition-colors`}>
                            <Check className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                </button>
                ))
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