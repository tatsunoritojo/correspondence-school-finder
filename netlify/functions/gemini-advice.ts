import { GoogleGenerativeAI } from "@google/generative-ai";

interface RequestBody {
    scores: Record<string, number>;
    role: "child" | "parent";
}

interface AIAdvice {
    summary: string;
    strengthComment: string;
    weaknessComment: string;
}

const AXES_MAP: Record<string, string> = {
    schooling_freq: "スクーリング頻度",
    online: "オンライン学習適性",
    cost: "学費",
    support: "サポート体制",
    social: "人間関係・交流",
    flexibility: "柔軟性",
    career: "進路・キャリア",
    mental: "メンタルケア",
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return false;
}

export default async function handler(event: {
    httpMethod: string;
    headers: Record<string, string>;
    body: string | null;
}) {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    // Rate limiting
    const clientIp = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (isRateLimited(clientIp)) {
        return {
            statusCode: 429,
            headers,
            body: JSON.stringify({ error: "Too many requests. Please try again later." }),
        };
    }

    // Validate API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY environment variable is not set");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Server configuration error" }),
        };
    }

    // Parse and validate request body
    let body: RequestBody;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Invalid request body" }),
        };
    }

    if (!body.scores || !body.role || !["child", "parent"].includes(body.role)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Missing required fields: scores, role" }),
        };
    }

    // Build prompt
    const sortedAxes = Object.entries(body.scores)
        .map(([id, score]) => ({ id, name: AXES_MAP[id] || id, score }))
        .sort((a, b) => b.score - a.score);

    const topAxis = sortedAxes[0];
    const bottomAxis = sortedAxes[sortedAxes.length - 1];

    const prompt = `あなたは通信制高校選びのプロフェッショナルなカウンセラーです。
以下の診断結果（スコア 1.0〜5.0）に基づき、ユーザー（${body.role === "child" ? "中学生本人" : "保護者"}）に対して、
共感的で前向きなアドバイスを作成してください。

【診断スコア】
${sortedAxes.map((a) => `${a.name}: ${a.score}`).join("\n")}

【タスク】
以下の3つの項目を含むJSONのみを返してください（余計なテキストは不要）。
1. summary: 全体的な傾向と、どのような学校生活が合っていそうか（100文字程度）
2. strengthComment: 最もスコアが高い要素（${topAxis.name}）について、それがどうプラスに働くか（80文字程度）
3. weaknessComment: 最もスコアが低い要素（${bottomAxis.name}）について、学校選びでどう注意すべきか、または気にしなくて良いか（80文字程度）

文体は、${body.role === "child" ? "親しみやすく、語りかけるようなトーン（〜だよ、〜だね）" : "丁寧で信頼感のあるトーン（〜です、〜ます）"}にしてください。

JSONフォーマットの例:
{"summary": "...", "strengthComment": "...", "weaknessComment": "..."}`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }

        const advice: AIAdvice = JSON.parse(jsonMatch[0]);

        // Validate response shape
        if (!advice.summary || !advice.strengthComment || !advice.weaknessComment) {
            throw new Error("Invalid response shape from Gemini");
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(advice),
        };
    } catch (error) {
        console.error("Gemini API error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to generate advice" }),
        };
    }
}
