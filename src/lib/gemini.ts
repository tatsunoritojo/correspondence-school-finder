import { GoogleGenAI, Type } from "@google/genai";
import { Axis, ScoreMap } from "../types";
import { AXES } from "../data/constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIAdvice {
  summary: string;
  strengthComment: string;
  weaknessComment: string;
}

export async function getPersonalizedAdvice(
  scores: ScoreMap,
  role: "child" | "parent"
): Promise<AIAdvice> {
  const modelId = "gemini-2.5-flash";

  // Identify top and bottom axes
  const sortedAxes = [...AXES].sort((a, b) => scores[b.id] - scores[a.id]);
  const topAxis = sortedAxes[0];
  const bottomAxis = sortedAxes[sortedAxes.length - 1];

  const prompt = `
    あなたは通信制高校選びのプロフェッショナルなカウンセラーです。
    以下の診断結果（スコア 1.0〜5.0）に基づき、ユーザー（${role === "child" ? "中学生本人" : "保護者"}）に対して、
    共感的で前向きなアドバイスを作成してください。

    【診断スコア】
    ${sortedAxes.map(a => `${a.name}: ${scores[a.id]}`).join("\n")}

    【タスク】
    以下の3つの項目を含むJSONを生成してください。
    1. summary: 全体的な傾向と、どのような学校生活が合っていそうか（100文字程度）
    2. strengthComment: 最もスコアが高い要素（${topAxis.name}）について、それがどうプラスに働くか（80文字程度）
    3. weaknessComment: 最もスコアが低い要素（${bottomAxis.name}）について、学校選びでどう注意すべきか、または気にしなくて良いか（80文字程度）

    文体は、${role === "child" ? "親しみやすく、語りかけるようなトーン（〜だよ、〜だね）" : "丁寧で信頼感のあるトーン（〜です、〜ます）"}にしてください。
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      strengthComment: { type: Type.STRING },
      weaknessComment: { type: Type.STRING },
    },
    required: ["summary", "strengthComment", "weaknessComment"],
  };

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const responseText = result.text;
    if (!responseText) throw new Error("No response from AI");
    
    return JSON.parse(responseText) as AIAdvice;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "現在AIアドバイスへの接続が混み合っていますが、診断結果は正確です。チャートを確認して、学校選びの参考にしてください。",
      strengthComment: `${topAxis.name}を重視する傾向があります。これを満たす学校なら、充実した生活が送れるでしょう。`,
      weaknessComment: `${bottomAxis.name}については、あまり無理をしなくて良いポイントかもしれません。`
    };
  }
}
