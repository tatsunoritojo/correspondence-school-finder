import type { Handler, HandlerEvent } from "@netlify/functions";

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
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return false;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
};

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: corsHeaders, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    const clientIp =
        event.headers["x-forwarded-for"] ||
        event.headers["client-ip"] ||
        "unknown";
    if (isRateLimited(clientIp)) {
        return {
            statusCode: 429,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Too many requests" }),
        };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        };
    }

    let body: RequestBody;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid JSON" }),
        };
    }

    if (!body.scores || !body.role || !["child", "parent"].includes(body.role)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Missing scores or role" }),
        };
    }

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
        // Gemini REST API を直接呼び出し（外部パッケージ不要）
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512,
                },
            }),
        });

        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            console.error("Gemini API error:", geminiResponse.status, errText);
            return {
                statusCode: 502,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Gemini API error",
                    status: geminiResponse.status,
                    detail: errText.slice(0, 200),
                }),
            };
        }

        const geminiData = await geminiResponse.json();
        const responseText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON in Gemini response:", responseText);
            return {
                statusCode: 502,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Invalid Gemini response format" }),
            };
        }

        const advice: AIAdvice = JSON.parse(jsonMatch[0]);

        if (!advice.summary || !advice.strengthComment || !advice.weaknessComment) {
            return {
                statusCode: 502,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Incomplete advice from Gemini" }),
            };
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(advice),
        };
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: "Internal function error",
                message: String(error),
            }),
        };
    }
};
