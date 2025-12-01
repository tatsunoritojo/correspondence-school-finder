export interface School {
  id: string;
  name: string;
  description: string;
  tags: string[];
  features: string[];
  website?: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface UserAnswers {
  [key: string]: string;
}

export interface AIRecommendation {
  schoolId: string;
  reason: string;
}

export interface DiagnosisResult {
  recommendations: AIRecommendation[];
  summaryMessage: string;
}
