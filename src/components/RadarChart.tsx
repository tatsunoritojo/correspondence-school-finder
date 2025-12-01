import React from "react";
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Axis, ScoreMap } from "../types";

interface Props {
  axes: Axis[];
  childScores?: ScoreMap;
  parentScores?: ScoreMap;
}

const RadarChart: React.FC<Props> = ({ axes, childScores, parentScores }) => {
  // Use chartLabel (max 4-5 chars) for chart to prevent truncation on mobile
  const data = axes.map((axis) => ({
    subject: axis.chartLabel, 
    fullMark: 5,
    child: childScores ? childScores[axis.id] : 0,
    parent: parentScores ? parentScores[axis.id] : 0,
  }));

  return (
    <div className="w-full h-[300px] md:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        {/* Reduced outerRadius to 60% for maximum mobile safety */}
        <RechartsRadar outerRadius="60%" data={data}>
          <PolarGrid stroke="#e7e5e4" strokeDasharray="3 3" /> {/* stone-200 */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#57534e", fontSize: 10, fontWeight: 500 }} // stone-600, 10px fixed
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={false} 
            axisLine={false} 
          />
          
          {childScores && (
            <Radar
              name="生徒"
              dataKey="child"
              stroke="#f97316" // orange-500
              strokeWidth={3}
              fill="#f97316"
              fillOpacity={parentScores ? 0.2 : 0.4}
              dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
            />
          )}
          
          {parentScores && (
            <Radar
              name="保護者"
              dataKey="parent"
              stroke="#14b8a6" // teal-500
              strokeWidth={3}
              fill="#14b8a6"
              fillOpacity={0.2}
              dot={{ r: 4, fill: "#14b8a6", strokeWidth: 0 }}
            />
          )}
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}/>
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;