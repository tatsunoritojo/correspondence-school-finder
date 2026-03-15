import { DiagnosisResult } from "../types";

export async function saveResultToServer(result: DiagnosisResult): Promise<string> {
    const res = await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            role: result.role,
            answers: result.answers,
            knockoutAnswers: result.knockoutAnswers,
            scores: result.scores,
            timestamp: result.timestamp,
        }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "保存に失敗しました" }));
        throw new Error(data.error || "保存に失敗しました");
    }

    const data = await res.json();
    return data.token;
}

export async function getResultFromServer(token: string): Promise<DiagnosisResult | null> {
    const res = await fetch(`/api/get-result?token=${encodeURIComponent(token)}`);

    if (res.status === 404) return null;

    if (!res.ok) {
        throw new Error("結果の取得に失敗しました");
    }

    return await res.json();
}
