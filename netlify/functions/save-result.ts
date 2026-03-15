import type { Handler, HandlerEvent } from "@netlify/functions";
import { sheets_v4, auth as googleAuth } from "@googleapis/sheets";
import crypto from "crypto";

interface SaveResultBody {
    role: "child" | "parent";
    answers: Record<string, unknown>;
    knockoutAnswers: string[];
    scores: Record<string, number>;
    timestamp: number;
}

const AXIS_IDS = ["AX01", "AX02", "AX03", "AX04", "AX05", "AX06", "AX07", "AX08"];

// Simple in-memory rate limiting (5 req/min/IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return false;
}

function generateToken(): string {
    const bytes = crypto.randomBytes(6);
    // Convert to base36 manually: read as integer, convert to string
    const num = bytes.readUIntBE(0, 6);
    return num.toString(36).padStart(8, "0").slice(0, 8);
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
        return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (isRateLimited(ip)) {
        return { statusCode: 429, headers: corsHeaders, body: JSON.stringify({ error: "送信回数の上限に達しました。しばらくお待ちください。" }) };
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !serviceEmail || !privateKey) {
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Google Sheets not configured" }) };
    }

    let body: SaveResultBody;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    if (!body.scores || !body.role || !body.answers || !body.timestamp) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "必須項目が不足しています" }) };
    }

    try {
        const authClient = new googleAuth.GoogleAuth({
            credentials: {
                client_email: serviceEmail,
                private_key: privateKey.replace(/\\n/g, "\n"),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const client = new sheets_v4.Sheets({ auth: await authClient.getClient() as any });

        // Generate unique token with collision retry
        let token = "";
        for (let attempt = 0; attempt < 3; attempt++) {
            token = generateToken();

            // Check for collision
            const existing = await client.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: "results!A:A",
            });

            const tokens = (existing.data.values || []).flat();
            if (!tokens.includes(token)) break;

            if (attempt === 2) {
                return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "トークン生成に失敗しました" }) };
            }
        }

        const now = new Date().toISOString();
        const row = [
            token,
            now,
            body.role,
            ...AXIS_IDS.map(id => body.scores[id] != null ? String(body.scores[id]) : ""),
            JSON.stringify(body.knockoutAnswers || []),
            JSON.stringify(body.answers),
            String(body.timestamp),
        ];

        await client.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "results!A:N",
            valueInputOption: "RAW",
            requestBody: { values: [row] },
        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ ok: true, token }),
        };
    } catch (error) {
        console.error("Save result error:", error);
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "結果の保存に失敗しました" }) };
    }
};
