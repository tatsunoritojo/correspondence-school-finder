import React from 'react';
import { Axis } from '../types';
import { Star, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AxisCardProps {
    axis: Axis;
    score: number;
}

export const AxisCard: React.FC<AxisCardProps> = ({ axis, score }) => {
    const stars = Math.round(score); // 1-5

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4 break-inside-avoid">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🏫</span>
                    <h3 className="font-bold text-gray-800">{axis.id}：{axis.name}</h3>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            size={16}
                            className={clsx(
                                i <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="p-5">
                <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-gray-700 leading-relaxed">
                    {axis.description}
                </div>

                <div className="mt-4">
                    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📝</span> OSで確認すべきこと
                    </h4>
                    <ul className="space-y-2">
                        {axis.osChecklist.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
