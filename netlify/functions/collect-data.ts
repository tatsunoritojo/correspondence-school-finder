import type { Handler, HandlerEvent } from "@netlify/functions";
import { sheets_v4, auth as googleAuth } from "@googleapis/sheets";

interface CollectDataBody {
    scores: Record<string, number>;
    role: "child" | "parent";
    demographics: {
        prefecture: string;
        gender: string;
        ageRange: string;
        childSchoolType: string;
        childGrade: string;
        childStatus: string;
    };
    satisfaction: number | null;
    freeText: string;
    email: string;
    timestamp: string;
}

// Simple in-memory rate limiting (3 req/min/IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;

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

const AXIS_IDS = ["AX01", "AX02", "AX03", "AX04", "AX05", "AX06", "AX07", "AX08"];

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

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !serviceEmail || !privateKey) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Google Sheets not configured" }),
        };
    }

    let body: CollectDataBody;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid JSON" }),
        };
    }

    if (!body.scores || typeof body.scores !== "object") {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Missing scores" }),
        };
    }

    if (!body.role || !["child", "parent"].includes(body.role)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid role" }),
        };
    }

    if (!body.timestamp) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Missing timestamp" }),
        };
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

        const demo = body.demographics || {} as CollectDataBody["demographics"];
        const row = [
            body.timestamp,
            body.role,
            demo.prefecture || "",
            demo.gender || "",
            demo.ageRange || "",
            demo.childSchoolType || "",
            demo.childGrade || "",
            demo.childStatus || "",
            body.satisfaction != null ? String(body.satisfaction) : "",
            body.freeText || "",
            body.email || "",
            ...AXIS_IDS.map((id) =>
                body.scores[id] != null ? String(body.scores[id]) : ""
            ),
        ];

        await client.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "data!A:S",
            valueInputOption: "RAW",
            requestBody: {
                values: [row],
            },
        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("Sheets API error:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: "Failed to write to sheet",
                message: String(error),
            }),
        };
    }
};
