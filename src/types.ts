export type AxisId =
  | "AX01" // Schooling Frequency Tolerance
  | "AX02" // Cost Sensitivity
  | "AX03" // Online Learning Aptitude
  | "AX04" // Self-Management vs. Support Needs
  | "AX05" // Career Orientation
  | "AX06" // School Life Experience Priority
  | "AX07" // Mental Health Support Needs
  | "AX08"; // Specialized Course Interest

export interface Axis {
  id: AxisId;
  name: string;
  nameEn?: string;
  definition: string;
  description?: string;
  shortDescription?: string;
  chartLabel?: string; // Ultra short label for radar chart
  psychologicalContext?: string; // For internal logic/AI context
  osChecklist: string[]; // Open School Questions
}

export type QuestionId = string;
export type QuestionType = "knockout" | "normal";

export interface Question {
  id: QuestionId;
  type: QuestionType;
  axis: AxisId | null; // null for knockout
  text: string;
}

export type AnswerValue = 1 | 2 | 3 | 4 | 5;
export type AnswerMap = Record<QuestionId, AnswerValue>;
export type Answers = AnswerMap; // Alias for compatibility
export type ScoreMap = Record<AxisId, number>;

export interface DiagnosisResult {
  role: "child" | "parent";
  answers: AnswerMap;
  knockoutAnswers: AxisId[];
  scores: ScoreMap;
  timestamp: number;
}

// Alias for compatibility
export type DiagnosticResult = DiagnosisResult;

export interface ParentChildData {
  child: DiagnosisResult | null;
  parent: DiagnosisResult | null;
}