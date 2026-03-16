import type { Handler, HandlerEvent } from "@netlify/functions";
import { sheets_v4, auth as googleAuth } from "@googleapis/sheets";

interface SendReportBody {
    email: string;
    name: string;
    pdfBase64?: string;
    resultUrl?: string;
    shareToken?: string;
    newsletterOptIn?: boolean;
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

async function saveNewsletterSubscriber(name: string, email: string, source: string): Promise<void> {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !serviceEmail || !privateKey) {
        console.error("Google Sheets not configured — skipping newsletter save");
        return;
    }

    const authClient = new googleAuth.GoogleAuth({
        credentials: {
            client_email: serviceEmail,
            private_key: privateKey.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = new sheets_v4.Sheets({ auth: await authClient.getClient() as any });
    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    const existing = await client.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "newsletter!D:D",
    });

    const rows = existing.data.values || [];
    let existingRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i][0]?.trim().toLowerCase() === normalizedEmail) {
            existingRowIndex = i;
            break;
        }
    }

    if (existingRowIndex >= 0) {
        const rowNum = existingRowIndex + 1;
        await client.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `newsletter!B${rowNum}:F${rowNum}`,
            valueInputOption: "RAW",
            requestBody: {
                values: [[now, name, normalizedEmail, source, "active"]],
            },
        });
    } else {
        await client.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "newsletter!A:F",
            valueInputOption: "RAW",
            requestBody: {
                values: [[now, now, name, normalizedEmail, source, "active"]],
            },
        });
    }
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

    // 構造化ログ: デバッグ用
    const isPdfMode = !!body.pdfBase64;
    const isUrlMode = !!body.shareToken;
    console.log("send-report request", {
        mode: isUrlMode ? "url" : isPdfMode ? "pdf" : "unknown",
        hasEmail: !!body.email,
        hasName: !!body.name,
        hasPdfBase64: isPdfMode,
        pdfLength: body.pdfBase64?.length ?? 0,
        hasShareToken: isUrlMode,
        hasResultUrl: !!body.resultUrl,
    });

    // バリデーション
    if (!body.email || !body.name) {
        return { statusCode: 400, body: JSON.stringify({ error: "必須項目が不足しています" }) };
    }

    if (!isPdfMode && !isUrlMode) {
        return { statusCode: 400, body: JSON.stringify({ error: "送信データが不足しています" }) };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return { statusCode: 400, body: JSON.stringify({ error: "メールアドレスの形式が正しくありません" }) };
    }

    if (isPdfMode && body.pdfBase64!.length > 10_000_000) {
        return { statusCode: 400, body: JSON.stringify({ error: "ファイルサイズが大きすぎます" }) };
    }

    try {
        // --- URL共有メール ---
        if (isUrlMode) {
            const resultUrl = body.resultUrl || "";
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "こどもの進路案内所 <onboarding@resend.dev>",
                    to: [body.email],
                    subject: `${body.name}さんの診断結果 — こどもの進路案内所`,
                    html: buildEmailHtmlWithUrl(body.name, resultUrl),
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Resend API error (url mode):", res.status, errorText);
                return { statusCode: 502, body: JSON.stringify({ error: "メール送信に失敗しました" }) };
            }
        }
        // --- PDF添付メール ---
        else {
            const resultUrl = body.resultUrl || "";
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
                    html: buildEmailHtml(body.name, resultUrl),
                    attachments: [
                        {
                            filename: `診断結果レポート_${body.name}.pdf`,
                            content: body.pdfBase64,
                            type: "application/pdf",
                        },
                    ],
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Resend API error (pdf mode):", res.status, errorText);
                return { statusCode: 502, body: JSON.stringify({ error: "メール送信に失敗しました" }) };
            }
        }

        // newsletter 保存
        if (body.newsletterOptIn) {
            try {
                await saveNewsletterSubscriber(body.name, body.email, isUrlMode ? "result_url_email" : "report_email");
            } catch (sheetErr) {
                console.error("Newsletter save failed (non-blocking):", sheetErr);
            }
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

function buildEmailHtmlWithUrl(name: string, resultUrl: string): string {
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
        ${name}さん、診断おつかれさまでした。
      </p>

      <p style="font-size:13px; color:#78716c; line-height:1.6; margin:0 0 20px;">
        以下のボタンから、いつでも診断結果を確認できます。
      </p>

      <div style="text-align:center;">
        <a href="${resultUrl}" style="display:inline-block; background:#f97316; color:#fff; text-decoration:none; padding:14px 32px; border-radius:12px; font-size:15px; font-weight:bold;">
          診断結果を見る
        </a>
      </div>

      <p style="font-size:12px; color:#a8a29e; text-align:center; margin:16px 0 0;">
        このURLをブックマークしておくと、いつでも結果を確認できます。
      </p>
    </div>

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
        レポートをPDFファイルとして添付しています。
      </p>

      <p style="font-size:13px; color:#78716c; line-height:1.6; margin:0 0 8px;">
        添付のPDFを保存してご活用ください。
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
