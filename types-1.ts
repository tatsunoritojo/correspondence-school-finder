/**
 * Type Definitions for Correspondence School Finder
 *
 * This file contains all core type definitions used throughout the application.
 * Import these types in your implementation files for type safety.
 */

// ============================================================================
// Axis Types
// ============================================================================

export type AxisId =
  | "AX01"  // Schooling Frequency Tolerance
  | "AX02"  // Cost Sensitivity
  | "AX03"  // Online Learning Aptitude
  | "AX04"  // Self-Management vs. Support Needs
  | "AX05"  // Career Orientation
  | "AX06"  // School Life Experience Priority
  | "AX07"  // Mental Health Support Needs
  | "AX08"; // Specialized Course Interest

export interface Axis {
  id: AxisId;
  name: string;
  nameEn: string;
  definition: string;
  emoji?: string;
}

// ============================================================================
// Question Types
// ============================================================================

export type QuestionId = string; // e.g., "Q0-1", "Q1-1", "Q1-2", etc.

export type QuestionType = "knockout" | "normal";

export interface Question {
  id: QuestionId;
  type: QuestionType;
  axis: AxisId | null;  // null for knockout questions
  text: string;
  order: number;
}

// ============================================================================
// Answer & Score Types
// ============================================================================

export type AnswerValue = 1 | 2 | 3 | 4 | 5;

export type AnswerMap = Record<QuestionId, AnswerValue>;

export type ScoreMap = Record<AxisId, number>; // Scores range from 0.0 to 5.0

export interface DiagnosisResult {
  role: UserRole;
  answers: AnswerMap;
  knockoutAxis: AxisId;
  scores: ScoreMap;
  topAxis: AxisId;           // Highest scoring axis
  timestamp: number;
}

// ============================================================================
// User & Session Types
// ============================================================================

export type UserRole = "child" | "parent";

export interface UserSession {
  sessionId: string;
  role: UserRole;
  createdAt: number;
}

// ============================================================================
// Parent-Child Comparison Types
// ============================================================================

export interface ParentChildComparison {
  childId: string;
  childResult: DiagnosisResult;
  parentResult: DiagnosisResult | null;
  gaps: ScoreMap | null;       // Absolute differences per axis
  maxGapAxis: AxisId | null;   // Axis with largest gap
}

// ============================================================================
// Open School Question Types
// ============================================================================

export interface OpenSchoolQuestion {
  axisId: AxisId;
  questions: string[];
}

// ============================================================================
// Search Keyword Types
// ============================================================================

export interface SearchKeywordRecommendation {
  axisId: AxisId;
  keywords: string[];
}

// ============================================================================
// Repository Interface (for future DB migration)
// ============================================================================

export interface DiagnosisRepository {
  /**
   * Save child's diagnostic result
   */
  saveChildResult(childId: string, result: DiagnosisResult): Promise<void>;

  /**
   * Load child's diagnostic result
   */
  loadChildResult(childId: string): Promise<DiagnosisResult | null>;

  /**
   * Save parent's diagnostic result
   */
  saveParentResult(childId: string, result: DiagnosisResult): Promise<void>;

  /**
   * Load parent's diagnostic result
   */
  loadParentResult(childId: string): Promise<DiagnosisResult | null>;

  /**
   * Get parent-child comparison
   */
  getComparison(childId: string): Promise<ParentChildComparison | null>;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

export interface RadarChartProps {
  childScores?: ScoreMap;
  parentScores?: ScoreMap;
  axes: Axis[];
  showGap?: boolean;
}

export interface AxisCardProps {
  axis: Axis;
  score: number;
  isTopAxis: boolean;
  openSchoolQuestions: string[];
}

export interface QuestionCardProps {
  question: Question;
  currentAnswer?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

// ============================================================================
// Analytics Event Types
// ============================================================================

export type AnalyticsEventName =
  | "view_start"
  | "answer_question"
  | "complete_diagnosis"
  | "view_result"
  | "share_to_parent"
  | "complete_parent"
  | "save_card"
  | "click_os_question";

export interface AnalyticsEvent {
  eventName: AnalyticsEventName;
  parameters: Record<string, string | number | boolean>;
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

export const AXES: Axis[] = [
  {
    id: "AX01",
    name: "スクーリング頻度の許容度",
    nameEn: "Schooling Frequency Tolerance",
    definition: "Comfort with attendance pace and interpersonal stress",
  },
  {
    id: "AX02",
    name: "学費・費用の重視度",
    nameEn: "Cost Sensitivity",
    definition: "Financial burden and sensitivity to additional fees",
  },
  {
    id: "AX03",
    name: "オンライン学習適性",
    nameEn: "Online Learning Aptitude",
    definition: "Suitability for home-based digital learning",
  },
  {
    id: "AX04",
    name: "自己管理力 vs サポート必要度",
    nameEn: "Self-Management vs. Support Needs",
    definition: "Autonomy level vs. need for external support",
  },
  {
    id: "AX05",
    name: "進路志向",
    nameEn: "Career Orientation",
    definition: "Future direction and motivation for academic paths",
  },
  {
    id: "AX06",
    name: "高校生活らしさの重視度",
    nameEn: "School Life Experience Priority",
    definition: "Expectations for friendships, events, and social interaction",
  },
  {
    id: "AX07",
    name: "メンタルケア／不登校対応ニーズ",
    nameEn: "Mental Health Support Needs",
    definition: "Need for psychological safety and flexible support",
  },
  {
    id: "AX08",
    name: "専門コース志向",
    nameEn: "Specialized Course Interest",
    definition: "Motivation for skill-based or interest-driven learning",
  },
];

export const KNOCKOUT_FACTOR = 1.4;
export const MAX_SCORE = 5.0;
export const MIN_SCORE = 0.0;
