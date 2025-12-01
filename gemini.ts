import { GoogleGenAI, Type } from "@google/genai";
import { School, UserAnswers, DiagnosisResult } from "./types";

// Initialize Gemini Client
// WARNING: In a production frontend app, API keys should be handled via a backend proxy
// to avoid exposing them. For this MVP/Demo, we use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIRecommendation(
  answers: UserAnswers,
  availableSchools: School[]
): Promise<DiagnosisResult> {
  
  const modelId = "gemini-2.5-flash"; // Optimized for speed and reasoning

  // Prepare context for the AI
  const prompt = `
    あなたはプロの教育アドバイザーです。
    高校進学や転校を考えている生徒の「価値観・希望」と、
    利用可能な「通信制高校のリスト」に基づいて、
    最も適した学校を推奨してください。

    【ユーザーの回答】
    ${JSON.stringify(answers, null, 2)}

    【学校リスト】
    ${JSON.stringify(availableSchools.map(s => ({ id: s.id, name: s.name, features: s.features, tags: s.tags })), null, 2)}

    【タスク】
    1. ユーザーの回答を分析し、最適な学校をトップ2つ選んでください。
    2. なぜその学校が合っているのか、ユーザーの回答内容を引用しながら、優しく励ますようなトーンで「理由」を記述してください。
    3. 最後に、全体的なアドバイス（summaryMessage）を100文字程度で記述してください。
  `;

  // Define the output schema structure
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            schoolId: { type: Type.STRING, description: "ID of the recommended school" },
            reason: { type: Type.STRING, description: "Personalized reason for recommendation" },
          },
          required: ["schoolId", "reason"],
        },
      },
      summaryMessage: {
        type: Type.STRING,
        description: "Overall encouraging advice for the student",
      },
    },
    required: ["recommendations", "summaryMessage"],
  };

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Balance between creativity and logic
      },
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(responseText) as DiagnosisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of API error (so the app doesn't crash)
    return {
      recommendations: availableSchools.slice(0, 2).map(s => ({
        schoolId: s.id,
        reason: "AIの接続に失敗しましたが、人気の学校をご案内します。"
      })),
      summaryMessage: "通信状況を確認して再度お試しください。",
    };
  }
}
