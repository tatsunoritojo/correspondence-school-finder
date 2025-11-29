import React from 'react';
import {
    Radar,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { ScoreMap } from '../types';
import { AXES } from '../data/axes';

interface RadarChartProps {
    childScores: ScoreMap;
    parentScores?: ScoreMap;
}

export const RadarChart: React.FC<RadarChartProps> = ({ childScores, parentScores }) => {
    const data = AXES.map((axis) => ({
        subject: axis.name,
        child: childScores[axis.id],
        parent: parentScores ? parentScores[axis.id] : 0,
        fullMark: 5,
    }));

    return (
        <div className="w-full h-[400px] bg-white rounded-2xl p-4">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />

                    <Radar
                        name="あなた（生徒）"
                        dataKey="child"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.3}
                    />

                    {parentScores && (
                        <Radar
                            name="保護者"
                            dataKey="parent"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="#10b981"
                            fillOpacity={0.3}
                        />
                    )}

                    <Legend />
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
};
