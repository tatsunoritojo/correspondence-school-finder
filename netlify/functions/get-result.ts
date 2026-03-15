import type { Handler, HandlerEvent } from "@netlify/functions";
import { sheets_v4, auth as googleAuth } from "@googleapis/sheets";

// Simple in-memory rate limiting (10 req/min/IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return false;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
};

const AXIS_IDS = ["AX01", "AX02", "AX03", "AX04", "AX05", "AX06", "AX07", "AX08"];

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: corsHeaders, body: "" };
    }
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (isRateLimited(ip)) {
        return { statusCode: 429, headers: corsHeaders, body: JSON.stringify({ error: "リクエストが多すぎます。しばらくお待ちください。" }) };
    }

    const token = event.queryStringParameters?.token;
    if (!token || !/^[a-z0-9]{4,12}$/.test(token)) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid token" }) };
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !serviceEmail || !privateKey) {
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Google Sheets not configured" }) };
    }

    try {
        const authClient = new googleAuth.GoogleAuth({
            credentials: {
                client_email: serviceEmail,
                private_key: privateKey.replace(/\\n/g, "\n"),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const client = new sheets_v4.Sheets({ auth: await authClient.getClient() as any });

        const response = await client.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: "results!A:N",
        });

        const rows = response.data.values || [];
        const row = rows.find(r => r[0] === token);

        if (!row) {
            return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "結果が見つかりません" }) };
        }

        // Parse row: token, created_at, role, AX01-AX08, knockout_answers(JSON), answers(JSON), timestamp
        const scores: Record<string, number> = {};
        AXIS_IDS.forEach((id, i) => {
            const val = parseFloat(row[3 + i]);
            if (!isNaN(val)) scores[id] = val;
        });

        const result = {
            role: row[2] as "child" | "parent",
            scores,
            knockoutAnswers: JSON.parse(row[11] || "[]"),
            answers: JSON.parse(row[12] || "{}"),
            timestamp: parseInt(row[13] || "0", 10),
        };

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error("Get result error:", error);
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "結果の取得に失敗しました" }) };
    }
};
