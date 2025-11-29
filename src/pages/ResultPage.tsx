import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RadarChart } from '../components/RadarChart';
import { AxisCard } from '../components/AxisCard';
import { SaveButton } from '../components/SaveButton';
import { AXES } from '../data/axes';
import { loadLocalProgress, saveChildResult } from '../lib/storage';
import { DiagnosticResult } from '../types';
import { Share2 } from 'lucide-react';

export const ResultPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [result, setResult] = useState<DiagnosticResult | null>(null);
    const [childResult, setChildResult] = useState<DiagnosticResult | null>(null); // For parent view

    useEffect(() => {
        // Try to get data from navigation state first (for parent flow)
        if (location.state?.result) {
            setResult(location.state.result);
            if (location.state.childResult) {
                setChildResult(location.state.childResult);
            }
        } else {
            // Fallback to local storage
            const saved = loadLocalProgress();
            if (saved) {
                setResult(saved);
            } else {
                navigate('/');
            }
        }
    }, [navigate, location.state]);

    if (!result) return null;

    const isParentView = !!childResult;
    const role = result.role;

    const handleShare = () => {
        if (role === 'child') {
            const id = saveChildResult(result);
            const url = `${window.location.origin}/diagnose?child_id=${id}`;
            navigator.clipboard.writeText(url);
            alert('保護者共有用のURLをコピーしました！\nLINEやメールで送って、保護者の方にも診断してもらいましょう。');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
            <div className="max-w-md mx-auto space-y-8 animate-fade-in">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">診断結果</h1>
                    <p className="text-sm text-gray-600">
                        {isParentView
                            ? '親子それぞれの価値観が可視化されました'
                            : 'あなたの学校選びの軸が見えてきました'}
                    </p>
                </div>

                {/* Radar Chart Section */}
                <div id="result-chart-section" className="bg-white p-4 rounded-2xl shadow-sm">
                    <RadarChart
                        childScores={isParentView ? childResult.scores : result.scores}
                        parentScores={isParentView ? result.scores : undefined}
                    />
                </div>

                {/* Gap Analysis (Parent View Only) */}
                {isParentView && (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                            <span>💡</span> 親子で話し合うポイント
                        </h3>
                        <p className="text-sm text-orange-700 leading-relaxed">
                            チャートの形が大きく違う部分は、価値観がズレている可能性があります。
                            お互いの考えを話し合ってみましょう。
                        </p>
                    </div>
                )}

                {/* Axis Cards */}
                <div className="space-y-4">
                    <h2 className="font-bold text-gray-700 text-lg px-2">
                        {isParentView ? 'あなたの重視ポイント' : 'あなたの重視ポイント詳細'}
                    </h2>
                    {AXES.map(axis => (
                        <AxisCard
                            key={axis.id}
                            axis={axis}
                            score={result.scores[axis.id]}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <SaveButton targetId="result-chart-section" fileName="school-diagnosis-chart" />

                    {role === 'child' && !isParentView && (
                        <button
                            onClick={handleShare}
                            className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Share2 size={20} />
                            保護者にも診断してもらう
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-white text-gray-600 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        トップに戻る
                    </button>
                </div>
            </div>
        </div>
    );
};
