export type Role = 'child' | 'parent';

export type AxisId =
    | 'AX01' // Schooling Frequency Tolerance
    | 'AX02' // Cost Sensitivity
    | 'AX03' // Online Learning Aptitude
    | 'AX04' // Self-Management vs. Support Needs
    | 'AX05' // Career Orientation
    | 'AX06' // School Life Experience Priority
    | 'AX07' // Mental Health Support Needs
    | 'AX08'; // Specialized Course Interest

export interface Axis {
    id: AxisId;
    name: string;
    definition: string;
    description: string; // For card UI
    osChecklist: string[]; // Open School questions
}

export type QuestionId = string; // e.g., "Q1-1", "Q0-1"

export interface Question {
    id: QuestionId;
    text: string;
    type: 'knockout' | 'normal';
    axis: AxisId | null; // null for knockout
}

export type AnswerValue = 1 | 2 | 3 | 4 | 5;

export type Answers = Record<QuestionId, AnswerValue>;

export type ScoreMap = Record<AxisId, number>;

export interface DiagnosticResult {
    role: Role;
    answers: Answers;
    knockoutAxis: AxisId | null;
    scores: ScoreMap;
    timestamp: number;
}
