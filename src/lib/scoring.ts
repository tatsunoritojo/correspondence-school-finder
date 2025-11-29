import { Answers, AxisId, Question, ScoreMap } from '../types';
import { AXES } from '../data/axes';

export function calculateScores(answers: Answers, questions: Question[], knockoutAxis: AxisId | null): ScoreMap {
    // Initialize scores
    const axisScores: Record<AxisId, number[]> = {
        AX01: [], AX02: [], AX03: [], AX04: [],
        AX05: [], AX06: [], AX07: [], AX08: []
    };

    // Group answers by axis
    questions.forEach(q => {
        if (q.axis && q.type === 'normal') {
            const value = answers[q.id];
            if (value) {
                axisScores[q.axis].push(value);
            }
        }
    });

    // Calculate average and apply knockout weight
    const finalScores: ScoreMap = {} as ScoreMap;

    AXES.forEach(axis => {
        const scores = axisScores[axis.id];
        let average = scores.length > 0
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0;

        // Apply Knockout multiplier
        if (knockoutAxis === axis.id) {
            average = average * 1.4;
        }

        // Cap at 5.0
        finalScores[axis.id] = Math.min(5.0, Number(average.toFixed(1)));
    });

    return finalScores;
}
