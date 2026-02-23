import { describe, it, expect } from 'vitest';
import { calculateScores, getTopAxis, calculateGaps } from './scoring';
import { AnswerMap, ScoreMap } from '../types';

describe('scoring.ts logic', () => {
  it('calculates average scores for normal questions', () => {
    const answers: AnswerMap = {
      'Q1-1': 4,
      'Q1-2': 5, // AX01 Average: 4.5
      'Q2-1': 1,
      'Q2-2': 1, // AX02 Average: 1.0
    };
    const scores = calculateScores(answers, []);
    
    expect(scores.AX01).toBe(4.5);
    expect(scores.AX02).toBe(1.0);
  });

  it('applies knockout factor (x1.4) correctly', () => {
    const answers: AnswerMap = {
      'Q1-1': 3,
      'Q1-2': 3, // AX01 Average: 3.0
    };
    // AX01 selected as knockout
    const scores = calculateScores(answers, ['AX01']);
    
    // 3.0 * 1.4 = 4.2
    expect(scores.AX01).toBe(4.2);
  });

  it('caps scores at 5.0', () => {
    const answers: AnswerMap = {
      'Q1-1': 5,
      'Q1-2': 5, // AX01 Average: 5.0
    };
    // 5.0 * 1.4 = 7.0 -> capped at 5.0
    const scores = calculateScores(answers, ['AX01']);
    
    expect(scores.AX01).toBe(5.0);
  });

  it('identifies the top axis correctly', () => {
    const scores: ScoreMap = {
      AX01: 5.0,
      AX02: 4.0,
      AX03: 3.0,
      AX04: 2.0,
      AX05: 1.0,
      AX06: 1.0,
      AX07: 1.0,
      AX08: 1.0,
    };
    const top = getTopAxis(scores);
    expect(top).toBe('AX01');
  });

  it('calculates gaps between child and parent scores', () => {
    const childScores: ScoreMap = {
      AX01: 5.0, AX02: 1.0, AX03: 3.0, AX04: 3.0,
      AX05: 3.0, AX06: 3.0, AX07: 3.0, AX08: 3.0,
    };
    const parentScores: ScoreMap = {
      AX01: 1.0, AX02: 5.0, AX03: 3.0, AX04: 3.0,
      AX05: 3.0, AX06: 3.0, AX07: 3.0, AX08: 3.0,
    };
    
    const { gaps, maxGapAxis } = calculateGaps(childScores, parentScores);
    
    expect(gaps.AX01).toBe(4.0);
    expect(gaps.AX02).toBe(4.0);
    // Since AX01 and AX02 have same gap, it should be deterministic (the first one)
    expect(maxGapAxis).toBe('AX01');
  });
});
