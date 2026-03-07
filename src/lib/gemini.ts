import { ScoreMap } from "../types";

const GEMINI_ENABLED = true;

/** Netlify Functions のエンドポイント */
const API_ENDPOINT = "/api/gemini-advice";

export interface AIAdvice {
  summary: string;
  strengthComment: string;
  weaknessComment: string;
}

const DEV_FALLBACK: AIAdvice = {
  summary:
    "あなたはメンタルケアや自己管理のサポートを重視しつつ、オンライン学習にも高い適性を持っています。自分のペースで安心して学べる環境が合っているようです。",
  strengthComment:
    "心のケアを大切にしながら、自分に合った学び方を見つけようとする姿勢がとても素晴らしいです。オンライン学習への適性も高く、柔軟な学習スタイルが活かせるでしょう。",
  weaknessComment:
    "学費や通学環境についても早めに情報を集めておくと、選択肢がさらに広がります。オープンスクールに参加して実際の雰囲気を確かめてみるのもおすすめです。",
};

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
      if (import.meta.env.DEV) {
        console.info("[DEV] Using fallback AI advice");
        return DEV_FALLBACK;
      }
      return null;
    }

    const data: AIAdvice = await response.json();

    // Validate response shape
    if (!data.summary || !data.strengthComment || !data.weaknessComment) {
      console.warn("Invalid response shape from Gemini API");
      if (import.meta.env.DEV) return DEV_FALLBACK;
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch AI advice:", error);
    if (import.meta.env.DEV) {
      console.info("[DEV] Using fallback AI advice");
      return DEV_FALLBACK;
    }
    return null;
  }
}
