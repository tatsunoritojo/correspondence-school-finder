import React from 'react';
import {
    Radar,
    RadarChart as RechartsRadar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
import { AXES } from '../data/constants';
import { AxisId, ScoreMap } from '../types';
import './PrintableReport.css';

interface PrintableReportProps {
    scores: ScoreMap;
    knockoutAnswers: AxisId[];
    respondentType: 'child' | 'parent';
    respondentName: string;
    diagnosisDate: Date;
}

const PrintableReport: React.FC<PrintableReportProps> = ({
    scores,
    knockoutAnswers,
    respondentType: _respondentType,
    respondentName,
    diagnosisDate,
}) => {
    // 日付フォーマット
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    // レーダーチャート用データ
    const chartData = AXES.map((axis) => ({
        subject: axis.chartLabel,
        score: scores[axis.id] || 0,
        fullMark: 5,
    }));

    // スコア上位3軸を取得して質問リストを生成
    const sortedAxes = [...AXES].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
    const topAxes = sortedAxes.slice(0, 3);

    // 質問リスト生成（上位3軸から各1問ずつ + knockoutから1問）
    const generateQuestions = () => {
        const questions: { axis: string; question: string }[] = [];

        // 上位3軸から各1問
        topAxes.forEach((axis) => {
            if (axis.osChecklist.length > 0) {
                questions.push({
                    axis: axis.chartLabel || axis.name,
                    question: axis.osChecklist[0],
                });
            }
        });

        // knockoutAnswersで選ばれた軸から追加
        knockoutAnswers.forEach((axisId) => {
            const axis = AXES.find((a) => a.id === axisId);
            if (axis && axis.osChecklist.length > 1 && questions.length < 5) {
                const alreadyIncluded = questions.some((q) => q.axis === (axis.chartLabel || axis.name));
                if (!alreadyIncluded) {
                    questions.push({
                        axis: axis.chartLabel || axis.name,
                        question: axis.osChecklist[0],
                    });
                }
            }
        });

        return questions.slice(0, 5);
    };

    // 星評価を生成
    const renderStars = (score: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span
                key={i}
                className={`star ${i < Math.round(score) ? 'star-filled' : 'star-empty'}`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="printable-report">
            {/* ヘッダー */}
            <header className="report-header">
                <h1>通信制高校診断結果レポート</h1>
            </header>

            {/* セクション1: あなたの診断結果 */}
            <section className="report-section">
                <h2>
                    <span className="section-number">1</span>
                    あなたの診断結果
                </h2>
                <div className="section-content-split">
                    {/* 左側: タイトルブロック */}
                    <div className="title-block">
                        <div className="title-decoration">
                            <div className="name-display">
                                <span className="name-label">お名前</span>
                                <span className="name-value">{respondentName}</span>
                            </div>
                            <div className="meta-info">
                                <div className="meta-item">
                                    <span className="meta-label">診断日</span>
                                    <span className="meta-value">{formatDate(diagnosisDate)}</span>
                                </div>
                                <div className="meta-item-priorities">
                                    <span className="meta-label">あなたが重要視する視点</span>
                                    <div className="priorities-tags">
                                        {knockoutAnswers.map((axisId) => {
                                            const axis = AXES.find((a) => a.id === axisId);
                                            return axis ? (
                                                <span key={axisId} className="priority-tag">
                                                    {axis.chartLabel || axis.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右側: レーダーチャート */}
                    <div className="radar-container">
                        <RechartsRadar
                            width={300}
                            height={300}
                            outerRadius="55%"
                            data={chartData}
                        >
                            <PolarGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#57534e', fontSize: 10, fontWeight: 500 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 5]}
                                tick={false}
                                axisLine={false}
                            />
                            <Radar
                                name="スコア"
                                dataKey="score"
                                stroke="#f97316"
                                strokeWidth={2}
                                fill="#f97316"
                                fillOpacity={0.3}
                                dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }}
                            />
                        </RechartsRadar>
                    </div>
                </div>
            </section>

            {/* セクション2: 診断結果の詳細 */}
            <section className="report-section">
                <h2>
                    <span className="section-number">2</span>
                    診断結果の詳細
                </h2>
                <div className="axes-grid">
                    {AXES.map((axis) => {
                        const score = scores[axis.id] || 0;
                        return (
                            <div key={axis.id} className="axis-card">
                                <div className="axis-card-header">
                                    <h3>{axis.shortDescription}</h3>
                                    <span className="score-badge">
                                        {score.toFixed(1)}
                                    </span>
                                </div>
                                <p className="description">{axis.definition}</p>
                                <div className="stars-container">{renderStars(score)}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* セクション3: オープンスクールで聞くべき質問 */}
            <section className="report-section">
                <h2>
                    <span className="section-number">3</span>
                    オープンスクールで聞くべき質問
                </h2>
                <ul className="question-list">
                    {generateQuestions().map((item, index) => (
                        <li key={index}>
                            <span className="question-checkbox" />
                            <span>
                                <span className="question-axis-label">{item.axis}</span>
                                {item.question}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* フッター */}
            <footer className="report-footer">
                <div className="footer-brand">
                    <span className="footer-brand-name">One Drop</span>
                    <span className="footer-brand-desc">東広島の学習塾</span>
                </div>
                <span className="footer-url">
                    https://correspondence-school-finder.netlify.app
                </span>
            </footer>
        </div>
    );
};

export default PrintableReport;
