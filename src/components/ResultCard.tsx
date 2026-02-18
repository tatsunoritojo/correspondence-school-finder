import React from "react";
import { Axis } from "../types";
import { CheckCircle, Star } from "lucide-react";

interface Props {
  axis: Axis;
  score: number;
  role: "child" | "parent";
}

const ResultCard: React.FC<Props> = ({ axis, score, role }) => {
  // Convert 1-5 score to stars
  const renderStars = (val: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(val) ? "text-amber-400 fill-amber-400" : "text-stone-200"
          }`}
      />
    ));
  };

  const isHigh = score >= 3.5;

  return (
    <div className="glass-card p-6 rounded-2xl mb-4 transition-all hover:scale-[1.01] border-stone-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="font-bold text-base md:text-lg text-stone-700 flex items-center gap-2">
          {axis.shortDescription}
        </h3>
        <div className="flex gap-1 bg-white px-2 py-1 rounded-full shadow-sm border border-stone-100 w-fit">
          {renderStars(score)}
          <span className="text-sm font-bold ml-1 text-stone-600">{score}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-stone-600 leading-relaxed">
          {role === 'child'
            ? isHigh ? `「${axis.shortDescription}」をとても大切に考えています。` : `「${axis.shortDescription}」へのこだわりは比較的落ち着いています。`
            : isHigh ? `お子様の学校選びにおいて、${axis.shortDescription}を強く希望されています。` : `それほど${axis.shortDescription}を最優先には考えていないようです。`
          }
          <br />
          <span className="text-xs text-stone-400 mt-1 block">{axis.definition}</span>
        </p>
      </div>

      <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100/50">
        <h4 className="text-xs font-bold text-orange-700 mb-3 flex items-center gap-1 uppercase tracking-wide">
          <CheckCircle className="w-3 h-3" />
          オープンスクールで聞くべきこと
        </h4>
        <ul className="space-y-2">
          {axis.osChecklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultCard;