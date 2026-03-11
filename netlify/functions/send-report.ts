import type { Handler, HandlerEvent } from "@netlify/functions";

interface SendReportBody {
    email: string;
    name: string;
    imageBase64: string; // data:image/png;base64,... の base64 部分
    resultUrl: string;   // 結果ページの URL（協力フォームへの導線）
}

// Simple in-memory rate limiting (3 req/min/IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return false;
}

const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" }, body: "" };
    }
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (isRateLimited(ip)) {
        return { statusCode: 429, body: JSON.stringify({ error: "送信回数の上限に達しました。しばらくお待ちください。" }) };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY is not set");
        return { statusCode: 500, body: JSON.stringify({ error: "サーバー設定エラーです" }) };
    }

    let body: SendReportBody;
    try {
        body = JSON.parse(event.body || "{}");
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: "不正なリクエストです" }) };
    }

    if (!body.email || !body.name || !body.imageBase64) {
        return { statusCode: 400, body: JSON.stringify({ error: "必須項目が不足しています" }) };
    }

    // 簡易メールバリデーション
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return { statusCode: 400, body: JSON.stringify({ error: "メールアドレスの形式が正しくありません" }) };
    }

    // base64 サイズ制限（約 5MB）
    if (body.imageBase64.length > 10_000_000) {
        return { statusCode: 400, body: JSON.stringify({ error: "画像サイズが大きすぎます" }) };
    }

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "こどもの進路案内所 <onboarding@resend.dev>",
                to: [body.email],
                subject: `${body.name}さんの診断結果レポート — こどもの進路案内所`,
                html: buildEmailHtml(body.name, body.resultUrl),
                attachments: [
                    {
                        filename: `診断結果レポート_${body.name}.png`,
                        content: body.imageBase64,
                        type: "image/png",
                    },
                ],
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Resend API error:", res.status, errorText);
            return { statusCode: 502, body: JSON.stringify({ error: "メール送信に失敗しました" }) };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true }),
        };
    } catch (err) {
        console.error("Send report error:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "メール送信中にエラーが発生しました" }) };
    }
};

function buildEmailHtml(name: string, resultUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#fef7ed; font-family:'Hiragino Sans','Meiryo',sans-serif;">
  <div style="max-width:560px; margin:0 auto; padding:32px 20px;">
    <div style="text-align:center; margin-bottom:24px;">
      <h1 style="font-size:20px; color:#44403c; margin:0;">こどもの進路案内所</h1>
      <p style="font-size:13px; color:#78716c; margin:8px 0 0;">診断結果レポート</p>
    </div>

    <div style="background:#fff; border-radius:16px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <p style="font-size:15px; color:#44403c; line-height:1.7; margin:0 0 16px;">
        ${name}さん、診断おつかれさまでした。<br>
        レポートを添付ファイルとしてお送りします。
      </p>

      <p style="font-size:13px; color:#78716c; line-height:1.6; margin:0 0 8px;">
        添付の画像ファイルを保存してご活用ください。
      </p>
    </div>

    ${resultUrl ? `
    <div style="background:#fff; border-radius:16px; padding:24px; margin-top:16px; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <p style="font-size:14px; color:#44403c; font-weight:bold; margin:0 0 8px;">
        📊 診断データの活用にご協力ください
      </p>
      <p style="font-size:13px; color:#78716c; line-height:1.6; margin:0 0 16px;">
        みなさんのデータが次の世代の高校選びのサポートになります。
      </p>
      <div style="text-align:center;">
        <a href="${resultUrl}" style="display:inline-block; background:#f97316; color:#fff; text-decoration:none; padding:10px 24px; border-radius:8px; font-size:14px; font-weight:bold;">
          協力する
        </a>
      </div>
    </div>
    ` : ''}

    <div style="text-align:center; margin-top:32px; padding-top:16px; border-top:1px solid #e7e5e4;">
      <p style="font-size:11px; color:#a8a29e; margin:0;">
        このメールは「こどもの進路案内所」から自動送信されています。<br>
        お心当たりがない場合は、このメールを無視してください。
      </p>
      <p style="font-size:11px; color:#a8a29e; margin:8px 0 0;">
        © 2025 One drop. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}

export { handler };
