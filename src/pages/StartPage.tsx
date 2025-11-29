import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users } from 'lucide-react';

export const StartPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStart = (role: 'child' | 'parent') => {
        navigate(`/questions?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">通信制高校 診断</h1>
                    <p className="text-gray-600">
                        あなたの価値観や優先したいことを整理して、<br />
                        自分に合った学校選びの軸を見つけましょう。
                    </p>
                </div>

                <div className="grid gap-4">
                    <button
                        onClick={() => handleStart('child')}
                        className="group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <User size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">生徒として診断する</h3>
                                <p className="text-sm text-gray-500">自分の気持ちを整理したい方</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleStart('parent')}
                        className="group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500 text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Users size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">保護者として診断する</h3>
                                <p className="text-sm text-gray-500">お子様の学校選びを考えたい方</p>
                            </div>
                        </div>
                    </button>
                </div>

                <p className="text-xs text-gray-400">
                    所要時間：約3分（全17問）
                </p>
            </div>
        </div>
    );
};
