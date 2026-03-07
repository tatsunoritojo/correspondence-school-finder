import { useState, useEffect, useRef } from "react";

type Props = {
    scores: Record<string, number>;
    role: "child" | "parent";
    onClose: (status: "submitted" | "dismissed") => void;
    isRevision?: boolean;
};

const FORM_VERSION = 1;
const FREE_TEXT_MAX = 500;

const PREFECTURES = [
    "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
    "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
    "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
    "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
    "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
    "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const GENDERS = ["男性", "女性", "その他", "回答しない"];
const AGE_RANGES = ["10代", "20代", "30代", "40代", "50代", "60代以上"];
const SCHOOL_TYPES = ["小学校", "中学校", "高校", "その他"];
const GRADES = ["1年生", "2年生", "3年生", "4年生", "5年生", "6年生"];
const CHILD_STATUSES = ["通常登校", "別室登校", "自宅中心の生活", "フリースクール等に通学", "その他"];

type Step = "ask" | "form" | "thanks" | "error";

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function DataConsentForm({ scores, role, onClose, isRevision = false }: Props) {
    const [step, setStep] = useState<Step>(isRevision ? "form" : "ask");
    const [sending, setSending] = useState(false);
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // demographics
    const [prefecture, setPrefecture] = useState("");
    const [gender, setGender] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [childSchoolType, setChildSchoolType] = useState("");
    const [childGrade, setChildGrade] = useState("");
    const [childStatus, setChildStatus] = useState("");
    const [satisfaction, setSatisfaction] = useState<number | null>(null);
    const [freeText, setFreeText] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (sending) return; // 二重送信防止
        setSending(true);

        let submissionId = localStorage.getItem('csf-submission-id') || "";
        let revision = parseInt(localStorage.getItem('csf-revision') || "-1", 10);

        if (!submissionId) {
            submissionId = generateId();
            revision = 0;
        } else {
            revision += 1;
        }

        const trimmedFreeText = freeText.trim().slice(0, FREE_TEXT_MAX);

        try {
            const res = await fetch("/.netlify/functions/collect-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scores,
                    role,
                    demographics: {
                        prefecture,
                        gender,
                        ageRange,
                        childSchoolType,
                        childGrade,
                        childStatus,
                    },
                    satisfaction,
                    freeText: trimmedFreeText,
                    email: email.trim(),
                    timestamp: new Date().toISOString(),
                    submissionId,
                    revision,
                    formVersion: FORM_VERSION,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            // 成功時のみ localStorage を更新
            localStorage.setItem('csf-submission-id', submissionId);
            localStorage.setItem('csf-revision', String(revision));
            localStorage.setItem('csf-form-version', String(FORM_VERSION));
            setStep("thanks");
        } catch (err) {
            console.error("Data collection failed:", err);
            setStep("error");
        } finally {
            setSending(false);
        }
    };

    if (step === "ask") {
        return (
            <div
                ref={containerRef}
                className={`glass-card rounded-2xl p-6 text-center border-2 border-orange-200 transition-all duration-700 ${
                    visible ? "opacity-100 translate-y-0 shadow-lg shadow-orange-100" : "opacity-0 translate-y-4"
                }`}
            >
                <p className="text-lg font-bold text-stone-700 mb-3">
                    診断データの提供にご協力いただけますか？
                </p>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                    みなさんのデータが、次の世代の高校選びを
                    <br className="md:hidden" />
                    より良くサポートする力になります。
                </p>
                <ul className="text-left text-sm text-stone-600 space-y-1.5 mb-6 max-w-xs mx-auto">
                    <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-0.5">&#8226;</span>
                        匿名の統計データとして活用します
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-0.5">&#8226;</span>
                        個人が特定されることはありません
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-0.5">&#8226;</span>
                        ご協力いただいた方にお礼のご連絡をさせていただく場合があります（任意）
                    </li>
                </ul>
                <button
                    onClick={() => setStep("form")}
                    className="bg-orange-500 hover:bg-orange-400 text-white py-3 px-6 rounded-xl font-bold transition-colors mb-3 w-full max-w-xs"
                >
                    協力する
                </button>
                <br />
                <button
                    onClick={() => onClose("dismissed")}
                    className="text-stone-400 text-sm underline bg-transparent border-none cursor-pointer"
                >
                    今回は見送る
                </button>
            </div>
        );
    }

    if (step === "thanks") {
        return (
            <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-lg font-bold text-stone-700 mb-2">
                    ご協力ありがとうございます！
                </p>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                    いただいたデータは、より良い高校選びの
                    <br className="md:hidden" />
                    サポートに活用させていただきます。
                </p>
                <button
                    onClick={() => onClose("submitted")}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 py-2 px-6 rounded-xl font-bold text-sm transition-colors"
                >
                    閉じる
                </button>
            </div>
        );
    }

    if (step === "error") {
        return (
            <div className="glass-card rounded-2xl p-6 text-center border-2 border-red-200">
                <p className="text-base font-bold text-stone-700 mb-2">
                    送信に失敗しました
                </p>
                <p className="text-sm text-stone-500 mb-4 leading-relaxed">
                    通信環境をご確認の上、もう一度お試しください。
                    <br />入力内容はそのまま保持されています。
                </p>
                <button
                    onClick={() => setStep("form")}
                    className="bg-orange-500 hover:bg-orange-400 text-white py-3 px-6 rounded-xl font-bold transition-colors w-full max-w-xs"
                >
                    フォームに戻る
                </button>
            </div>
        );
    }

    // step === "form"
    return (
        <div className="glass-card rounded-2xl p-6">
            <p className="text-sm font-bold text-stone-700 mb-1 text-center">
                以下の項目にご回答ください（すべて任意です）
            </p>
            {isRevision && (
                <p className="text-xs text-stone-400 mb-3 text-center">
                    最新の内容で上書き保存されます（過去の回答は記録として保持されます）
                </p>
            )}

            <div className="space-y-5">
                {/* Group: あなたについて */}
                <GroupLabel label="あなたについて" />
                <FormSelect label="お住まいの都道府県" value={prefecture} onChange={setPrefecture} options={PREFECTURES} />
                <FormSelect label="性別" value={gender} onChange={setGender} options={GENDERS} />
                <FormSelect label="年代" value={ageRange} onChange={setAgeRange} options={AGE_RANGES} />

                {/* Group: お子さまについて */}
                <GroupLabel label="お子さまについて" />
                <FormSelect label="学校種" value={childSchoolType} onChange={setChildSchoolType} options={SCHOOL_TYPES} />
                <FormSelect label="学年" value={childGrade} onChange={setChildGrade} options={GRADES} />
                <FormSelect label="現在の状況" value={childStatus} onChange={setChildStatus} options={CHILD_STATUSES} />

                {/* Group: 診断について */}
                <GroupLabel label="診断について" />
                <div>
                    <label className="text-sm font-medium text-stone-600 block mb-2">
                        この診断は役に立ちましたか？
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setSatisfaction(n)}
                                className={`w-7 h-7 text-xl leading-none bg-transparent border-none cursor-pointer transition-colors ${
                                    satisfaction != null && n <= satisfaction
                                        ? "text-orange-400"
                                        : "text-stone-300"
                                }`}
                                aria-label={`${n}点`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-stone-600 block mb-2">
                        ご意見・ご感想（自由記述）
                    </label>
                    <textarea
                        rows={3}
                        value={freeText}
                        onChange={(e) => {
                            if (e.target.value.length <= FREE_TEXT_MAX) {
                                setFreeText(e.target.value);
                            }
                        }}
                        placeholder="診断で分かりにくかった点、追加してほしい項目など"
                        className="w-full p-3 rounded-lg border border-stone-200 bg-white text-stone-700 text-sm resize-none"
                    />
                    <p className="text-xs text-stone-400 text-right mt-1">
                        {freeText.length}/{FREE_TEXT_MAX}
                    </p>
                </div>

                {/* Group: ご連絡先 */}
                <GroupLabel label="ご連絡先" />
                <div>
                    <p className="text-xs text-stone-500 mb-2 leading-relaxed">
                        ご協力いただいた方にお礼のご連絡をさせていただく場合があります。
                        <br />※ 連絡不要の方は空欄のままで構いません
                    </p>
                    <label className="text-sm font-medium text-stone-600 block mb-1">
                        メールアドレス <span className="text-xs text-stone-400 ml-2">任意</span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full p-3 rounded-lg border border-stone-200 bg-white text-stone-700 text-sm"
                    />
                </div>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="bg-orange-500 hover:bg-orange-400 text-white py-3 px-6 rounded-xl font-bold transition-colors w-full max-w-xs disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                    {sending && (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {sending ? "送信中..." : "送信する"}
                </button>
                <button
                    onClick={() => onClose("dismissed")}
                    disabled={sending}
                    className="text-stone-400 text-sm underline bg-transparent border-none cursor-pointer mt-3 disabled:opacity-30"
                >
                    やめる
                </button>
            </div>
        </div>
    );
}

function GroupLabel({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 pt-2">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-xs font-bold text-stone-400">{label}</span>
            <div className="h-px bg-stone-200 flex-1" />
        </div>
    );
}

function FormSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <div>
            <label className="text-sm font-medium text-stone-600 block mb-1">
                {label} <span className="text-xs text-stone-400 ml-2">任意</span>
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 rounded-lg border border-stone-200 bg-white text-stone-700 text-sm"
            >
                <option value="">選択してください</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
