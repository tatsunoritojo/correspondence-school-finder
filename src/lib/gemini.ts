import { ScoreMap } from "../types";

const GEMINI_ENABLED = true;

/** Netlify Functions のエンドポイント */
const API_ENDPOINT = "/api/gemini-advice";

export interface AIAdvice {
  summary: string;
  strengthComment: string;
  weaknessComment: string;
}

export async function getPersonalizedAdvice(
  scores: ScoreMap,
  role: "child" | "parent"
): Promise<AIAdvice | null> {
  if (!GEMINI_ENABLED) {
    return null;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scores, role }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned ${response.status}`);
      return null;
    }

    const data: AIAdvice = await response.json();

    // Validate response shape
    if (!data.summary || !data.strengthComment || !data.weaknessComment) {
      console.warn("Invalid response shape from Gemini API");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch AI advice:", error);
    return null;
  }
}
