import { AnswerMap, AxisId, ScoreMap } from "../types";
import { AXES, QUESTIONS } from "../data/constants";

/**
 * Calculates scores for all axes based on user answers.
 * Applies the Knockout Factor (x1.4) to the selected priority axis.
 */
export function calculateScores(
  answers: AnswerMap,
  knockoutAnswers: AxisId[]
): ScoreMap {
  // Initialize scores bucket
  const rawScores: Record<AxisId, number[]> = {
    AX01: [], AX02: [], AX03: [], AX04: [],
    AX05: [], AX06: [], AX07: [], AX08: []
  };

  // 1. Group scores by axis
  QUESTIONS.forEach((q) => {
    if (q.type === "normal" && q.axis) {
      const val = answers[q.id];
      if (val !== undefined && typeof val === 'number') {
        rawScores[q.axis].push(val);
      }
    }
  });

  const result: ScoreMap = {} as ScoreMap;

  // 2. Calculate averages and apply Knockout Factor
  AXES.forEach((axis) => {
    const scores = rawScores[axis.id];
    let avg = 0;

    if (scores.length > 0) {
      const sum = scores.reduce((a, b) => a + b, 0);
      avg = sum / scores.length;
    } else {
      // If no questions answered (should not happen in full flow), default to 0 or 1
      avg = 1;
    }

    // Apply Knockout Factor
    // Specification: "Selected axis score is multiplied by x1.4"
    if (knockoutAnswers.includes(axis.id)) {
      avg = avg * 1.4;
    }

    // Cap at 5.0
    result[axis.id] = Math.min(5.0, Number(avg.toFixed(1)));
  });

  return result;
}

/**
 * Determines the 'Top Axis' (Strengths)
 */
export function getTopAxis(scores: ScoreMap): AxisId {
  let maxScore = -1;
  let topAxis: AxisId = "AX01";

  // Use defined order to be deterministic if tie
  AXES.forEach((axis) => {
    if (scores[axis.id] > maxScore) {
      maxScore = scores[axis.id];
      topAxis = axis.id;
    }
  });

  return topAxis;
}

/**
 * Calculates the gaps between parent and child scores.
 * Returns a map of absolute differences and the axis with the maximum gap.
 */
export function calculateGaps(child: ScoreMap, parent: ScoreMap): { gaps: ScoreMap, maxGapAxis: AxisId } {
  let maxGap = -1;
  let maxGapAxis: AxisId = "AX01";
  const gaps: ScoreMap = {} as ScoreMap;

  AXES.forEach(axis => {
    const gap = Math.abs(child[axis.id] - parent[axis.id]);
    gaps[axis.id] = Number(gap.toFixed(1));

    if (gap > maxGap) {
      maxGap = gap;
      maxGapAxis = axis.id;
    }
  });

  return { gaps, maxGapAxis };
}
