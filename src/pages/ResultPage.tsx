import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { LocalStorageRepository } from "../lib/storage";
import { getResultFromServer } from "../lib/resultApi";
import { getPersonalizedAdvice, AIAdvice } from "../lib/gemini";
import { AXES, COMMUTING_LABELS, EXAM_LABELS, TRANSPORTATION_LABELS, SCHEDULE_LABELS } from "../data/constants";
import { Axis, ParentChildData } from "../types";
import RadarChart from "../components/RadarChart";

import PrintableReport from "../components/PrintableReport";
import NameInputDialog, { SaveFormat, SaveMode } from "../components/NameInputDialog";
import ReportOverlay from "../components/ReportOverlay";
import { Share2, RefreshCw, MessageCircle, Sparkles, AlertCircle, ChevronDown, FileText, Mail, BarChart3, ThumbsUp, Lightbulb, Check as CheckIcon } from "lucide-react";
import { isMobileDevice } from "../lib/deviceDetection";
import { trackEvent } from "../lib/analytics";
import { useTrackView } from "../hooks/useTrackView";
import DataConsentForm from "../components/DataConsentForm";

const ResultPage = () => {
    const [searchParams] = useSearchParams();
    const { token: routeToken } = useParams<{ token?: string }>();
    const navigate = useNavigate();
    const childId = searchParams.get("child_id");
    const role = (searchParams.get("role") as "child" | "parent") || "child";
    const shareToken = routeToken || searchParams.get("token") || null;

    const [data, setData] = useState<ParentChildData | null>(null);
    const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [showConditions, setShowConditions] = useState(false);
    const [openAxisIds, setOpenAxisIds] = useState<Set<string>>(new Set());
    const [copied, setCopied] = useState(false);

    // Data consent: "none" | "dismissed" | "submitted"
    const [formStatus, setFormStatus] = useState<"none" | "dismissed" | "submitted">(
        () => (localStorage.getItem('csf-form-status') as "dismissed" | "submitted") || "none"
    );
    const [isRevision, setIsRevision] = useState(false);
    const [consentAccepted, setConsentAccepted] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    // PDF Download State
    const [showNameDialog, setShowNameDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<SaveMode>('email');
    const [respondentName, setRespondentName] = useState("");
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Report Overlay State (mobile fallback)
    const [showReportOverlay, setShowReportOverlay] = useState(false);
    const [reportImageDataUrl, setReportImageDataUrl] = useState<string | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);
    const printableRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const ctaSectionRef = useRef<HTMLDivElement>(null);
    const detailCardsRef = useRef<HTMLDivElement>(null);
    const oneDropRef = useRef<HTMLDivElement>(null);

    // GA4 viewport tracking
    useTrackView(chartRef, "chart_view");
    useTrackView(ctaSectionRef, "cta_section_view");
    useTrackView(detailCardsRef, "detail_cards_view");
    useTrackView(oneDropRef, "one_drop_banner_view");

    // GA4 page view
    useEffect(() => {
        trackEvent("result_page_view", { role });
    }, [role]);

    useEffect(() => {
        const loadData = async () => {
            let loadedData: ParentChildData | null = null;

            // 1. Try loading from server if we have a share token
            if (shareToken) {
                try {
                    const serverResult = await getResultFromServer(shareToken);
                    if (serverResult) {
                        loadedData = { child: null, parent: null };
                        if (serverResult.role === "child") {
                            loadedData.child = serverResult;
                        } else {
                            loadedData.parent = serverResult;
                        }
                        // Cache in localStorage for future visits
                        if (childId) {
                            await LocalStorageRepository.saveResult(childId, serverResult);
                        }
                    }
                } catch (e) {
                    console.error("Failed to load from server:", e);
                }
            }

            // 2. Fallback to localStorage
            if (!loadedData && childId) {
                loadedData = await LocalStorageRepository.loadData(childId);
            }

            if (!loadedData) {
                setData({ child: null, parent: null });
                return;
            }

            setData(loadedData);

            // Generate AI Advice
            const myResult = role === "child" ? loadedData.child : loadedData.parent;
            if (myResult && !aiAdvice && !loadingAdvice) {
                setLoadingAdvice(true);
                try {
                    const advice = await getPersonalizedAdvice(myResult.scores, role);
                    setAiAdvice(advice);
                    trackEvent("ai_advice_loaded");
                } finally {
                    setLoadingAdvice(false);
                }
            }
        };

        if (shareToken || childId) {
            loadData();
        }
    }, [childId, role, shareToken]);

    // Scroll Listener
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setShowScrollIndicator(false);
            } else {
                setShowScrollIndicator(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
        </div>
    );

    const displayResult = role === "child" ? data.child : data.parent;
    // Fallback to viewing child data if parent hasn't answered yet but opens the link
    const finalDisplay = displayResult || data.child;

    if (!finalDisplay) return <div className="p-8 text-center text-stone-500">データが見つかりません</div>;

    const childScores = data.child?.scores;
    const parentScores = data.parent?.scores;

    // Sorting and relative grouping
    const currentScores = finalDisplay.scores;
    const sortedAxes = [...AXES].sort((a, b) => currentScores[b.id] - currentScores[a.id]);
    const avgScore = AXES.reduce((sum, ax) => sum + currentScores[ax.id], 0) / AXES.length;
    const highAxes = sortedAxes.filter(ax => currentScores[ax.id] >= avgScore);
    const lowAxes = sortedAxes.filter(ax => currentScores[ax.id] < avgScore);

    // Report Save Handlers
    const handleDownloadClick = () => {
        setDialogMode('download');
        setShowNameDialog(true);
    };

    /**
     * Canvas を生成する共通処理
     */
    const generateCanvas = async (): Promise<HTMLCanvasElement | null> => {
        if (!printableRef.current) return null;

        printableRef.current.style.position = 'absolute';
        printableRef.current.style.left = '-9999px';
        printableRef.current.style.display = 'block';

        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(printableRef.current, {
            scale: 3,
            backgroundColor: '#fff7ed',
            useCORS: true,
            logging: false,
            onclone: (clonedDoc) => {
                const glassCards = clonedDoc.querySelectorAll('.glass-card');
                glassCards.forEach((el) => {
                    (el as HTMLElement).style.backdropFilter = 'none';
                    (el as HTMLElement).style.background = '#fff7ed';
                });
            }
        });

        printableRef.current.style.display = 'none';
        return canvas;
    };

    /**
     * Canvas → PDF base64 を生成する
     */
    const canvasToPdfBase64 = (canvas: HTMLCanvasElement): string => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // A4幅に合わせてスケーリング
        const pdfWidth = 210; // mm
        const pdfHeight = (imgHeight / imgWidth) * pdfWidth;

        const pdf = new jsPDF({
            orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        // data:application/pdf;base64,... から base64 部分のみ返す
        return pdf.output('datauristring').split(',')[1];
    };

    /**
     * メールでレポートを送信する（URL送信 or PDF添付フォールバック）
     */
    const sendReportByEmail = async (canvas: HTMLCanvasElement | null, email: string, newsletterOptIn?: boolean) => {
        const resultUrl = getShareUrl();

        const payload: Record<string, unknown> = {
            email,
            name: respondentName,
            resultUrl,
            newsletterOptIn: newsletterOptIn ?? false,
        };

        // トークンがある場合はURLのみ、なければPDF添付
        if (shareToken) {
            payload.shareToken = shareToken;
        } else if (canvas) {
            payload.pdfBase64 = canvasToPdfBase64(canvas);
        }

        const res = await fetch('/api/send-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({ error: '送信に失敗しました' }));
            throw new Error(data.error || '送信に失敗しました');
        }
    };

    /**
     * デスクトップ用: 直接ダウンロード
     */
    const downloadReport = (canvas: HTMLCanvasElement, format: SaveFormat) => {
        const fileName = `診断結果レポート_${respondentName}`;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = format === 'pdf' ? `${fileName}.pdf` : `${fileName}.png`;
        link.href = url;
        link.click();
    };

    /**
     * 保存フロー: メール送信 or ダウンロード
     */
    const handleSaveConfirm = async (format: SaveFormat, mode: SaveMode, email?: string, newsletterOptIn?: boolean) => {
        if (mode === 'email-url') {
            // URL-only email: no canvas needed
            if (!email) return;
            setIsGeneratingPdf(true);
            setShowNameDialog(false);
            try {
                await sendReportByEmail(null, email, newsletterOptIn);
                trackEvent('report_sent_email_url');
                alert('メールを送信しました。受信箱をご確認ください。');
            } catch (error) {
                console.error('Email send failed:', error);
                alert(error instanceof Error ? error.message : '送信に失敗しました。もう一度お試しください。');
            } finally {
                setIsGeneratingPdf(false);
            }
            return;
        }

        if (!respondentName.trim()) return;

        setIsGeneratingPdf(true);
        setShowNameDialog(false);

        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const canvas = await generateCanvas();
            if (!canvas) {
                alert('レポートの生成に失敗しました。ページをリロードしてお試しください。');
                return;
            }

            if (mode === 'email' && email) {
                await sendReportByEmail(canvas, email, newsletterOptIn);
                trackEvent('report_sent_email');
                alert('メールを送信しました。受信箱をご確認ください。');
            } else {
                downloadReport(canvas, format);
                trackEvent('report_downloaded');
            }
        } catch (error) {
            console.error('Report save failed:', error);
            alert(error instanceof Error ? error.message : '保存に失敗しました。もう一度お試しください。');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handlePdfDownloadCancel = () => {
        setShowNameDialog(false);
        setRespondentName("");
    };

    const getShareUrl = (): string => {
        if (shareToken) {
            return `${window.location.origin}/r/${shareToken}`;
        }
        return window.location.href;
    };

    const handleShareResult = async () => {
        const shareUrl = getShareUrl();
        const shareText = "通信制高校診断の結果です。あなたもやってみませんか？";

        trackEvent("share_result_click", { has_token: !!shareToken });

        // モバイル: Web Share API を優先
        if (isMobileDevice() && navigator.share) {
            try {
                await navigator.share({
                    title: "通信制高校診断の結果",
                    text: shareText,
                    url: shareUrl,
                });
                return;
            } catch (e) {
                if ((e as DOMException).name === "AbortError") return;
            }
        }

        // PC / フォールバック: クリップボードにコピー
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            prompt("以下のURLをコピーしてください:", shareUrl);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/30 pb-8 relative">
            <div className="max-w-3xl mx-auto p-6" ref={resultRef}>

                {/* Header */}
                <div className="text-center mb-6 mt-4">
                    <h1 className="text-xl md:text-2xl font-bold text-stone-700">
                        {role === "child" ? "あなたの学校選びの軸" : "お子様との価値観診断"}
                    </h1>
                    {data.parent && data.child && (
                        <p className="text-teal-600 font-bold mt-2 flex items-center justify-center gap-1 text-xs bg-teal-50 py-1 px-3 rounded-full inline-flex mx-auto">
                            <MessageCircle size={12} /> 親子マッチング完了
                        </p>
                    )}

                    {/* Scroll Indicator (Mobile) */}
                    <div className={`mt-6 md:hidden transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex flex-col items-center gap-1 animate-bounce text-stone-400">
                            <span className="text-[10px] font-bold tracking-widest uppercase">Scroll</span>
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div ref={chartRef} className="glass-card p-6 rounded-2xl mb-6 relative overflow-hidden shadow-lg">
                    <h2 className="text-lg font-bold text-center mb-4 text-stone-600">バランスチャート</h2>
                    <RadarChart
                        axes={AXES}
                        childScores={childScores}
                        parentScores={parentScores}
                    />
                    {data.parent && data.child && (
                        <div className="mt-4 p-4 bg-white/60 rounded-xl border border-teal-100 text-center text-xs text-stone-600">
                            <p>
                                <span className="text-orange-500 font-bold">● 生徒</span> と
                                <span className="text-teal-500 font-bold ml-2">● 保護者</span>
                            </p>
                            <p className="mt-1">形が重ならない部分は、話し合うべきポイントです。</p>
                        </div>
                    )}
                </div>

                {/* AI Advisor Section */}
                {loadingAdvice && (
                    <div className="glass-card p-6 md:p-8 rounded-2xl mb-6 shadow-xl animate-pulse">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-400">
                                <Sparkles size={18} />
                            </div>
                            <h2 className="font-bold text-lg text-stone-400">AI アドバイザー</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                            <div className="h-4 bg-stone-200 rounded w-full"></div>
                            <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                        </div>
                        <p className="text-xs text-stone-400 mt-4 text-center">AI がアドバイスを作成しています...</p>
                    </div>
                )}
                {aiAdvice && (
                    <div className="glass-card p-6 md:p-8 rounded-2xl mb-6 shadow-xl animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                <Sparkles size={18} />
                            </div>
                            <h2 className="font-bold text-lg text-stone-700">AI アドバイザー</h2>
                        </div>
                        <p className="text-stone-700 leading-relaxed mb-6 font-medium">
                            {aiAdvice.summary}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-orange-50/80 p-4 rounded-xl border border-orange-100">
                                <span className="text-xs font-bold text-orange-600 mb-1 flex items-center gap-1">
                                    <ThumbsUp size={12} />
                                    あなたの強み
                                </span>
                                <p className="text-sm text-stone-700 mt-1">{aiAdvice.strengthComment}</p>
                            </div>
                            <div className="bg-stone-100/50 p-4 rounded-xl">
                                <span className="text-xs font-bold text-stone-500 mb-1 flex items-center gap-1">
                                    <Lightbulb size={12} />
                                    アドバイス
                                </span>
                                <p className="text-sm text-stone-700 mt-1">{aiAdvice.weaknessComment}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Commuting / Exam Preferences (Accordion) */}
                <div className="my-6 border-t border-stone-200/60" />
                <div ref={ctaSectionRef}>
                    <button
                        onClick={() => setShowConditions(prev => !prev)}
                        className="w-full glass-card p-4 rounded-2xl flex items-center justify-between bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-white/60"
                    >
                        <span className="flex items-center gap-2 text-base font-bold text-stone-700">
                            <FileText size={18} className="text-orange-400" />
                            通学条件・入試項目の希望
                        </span>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${showConditions ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: showConditions ? '600px' : '0px', opacity: showConditions ? 1 : 0 }}
                    >
                        <div className="glass-card p-6 rounded-2xl space-y-4 mt-2">
                            <div>
                                <h3 className="text-sm font-bold text-stone-500 mb-2">通学時間</h3>
                                <p className="text-base text-stone-700 font-medium">
                                    {finalDisplay.answers["Q9-1"]
                                        ? COMMUTING_LABELS[finalDisplay.answers["Q9-1"] as string] || "未回答"
                                        : "未回答"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-stone-500 mb-2">通学方法の許容範囲</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(finalDisplay.answers["Q11-1"]) && (finalDisplay.answers["Q11-1"] as string[]).length > 0 ? (
                                        (finalDisplay.answers["Q11-1"] as string[]).map((val) => (
                                            <span key={val} className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                                                {TRANSPORTATION_LABELS[val] || val}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-base text-stone-700 font-medium">未回答</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-stone-500 mb-2">登校時間の許容範囲</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(finalDisplay.answers["Q12-1"]) && (finalDisplay.answers["Q12-1"] as string[]).length > 0 ? (
                                        (finalDisplay.answers["Q12-1"] as string[]).map((val) => (
                                            <span key={val} className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                                                {SCHEDULE_LABELS[val] || val}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-base text-stone-700 font-medium">未回答</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-stone-500 mb-2">希望する入試方法</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(finalDisplay.answers["Q10-1"]) && (finalDisplay.answers["Q10-1"] as string[]).length > 0 ? (
                                        (finalDisplay.answers["Q10-1"] as string[]).map((val) => (
                                            <span key={val} className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                                                {EXAM_LABELS[val] || val}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-base text-stone-700 font-medium">未回答</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Accordion Section */}
                <div className="my-6 border-t border-stone-200/60" />
                <div ref={detailCardsRef} className="space-y-6">
                    {/* High group */}
                    <div>
                        <h2 className="text-base font-bold text-stone-700 ml-2 mb-3 flex items-center gap-2">
                            <AlertCircle size={18} className="text-orange-400" />
                            {role === "child" ? "あなたが重視しているポイント" : "重視度が高いポイント"}
                        </h2>
                        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-stone-100">
                            {highAxes.map((axis: Axis) => (
                                <AxisAccordionItem key={axis.id} axis={axis} score={currentScores[axis.id]} role={role} isAboveAvg={true} isOpen={openAxisIds.has(axis.id)} onToggle={() => setOpenAxisIds(prev => {
                                    const next = new Set(prev);
                                    if (next.has(axis.id)) next.delete(axis.id); else next.add(axis.id);
                                    return next;
                                })} />
                            ))}
                        </div>
                    </div>

                    {/* Low group */}
                    {lowAxes.length > 0 && (
                        <div>
                            <h2 className="text-base font-bold text-stone-500 ml-2 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} className="text-stone-400" />
                                {role === "child" ? "比較的こだわりが少ないポイント" : "重視度が低めのポイント"}
                            </h2>
                            <div className="glass-card rounded-2xl overflow-hidden divide-y divide-stone-100">
                                {lowAxes.map((axis: Axis) => (
                                    <AxisAccordionItem key={axis.id} axis={axis} score={currentScores[axis.id]} role={role} isAboveAvg={false} isOpen={openAxisIds.has(axis.id)} onToggle={() => setOpenAxisIds(prev => {
                                        const next = new Set(prev);
                                        if (next.has(axis.id)) next.delete(axis.id); else next.add(axis.id);
                                        return next;
                                    })} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Section */}
                <div className="my-6 border-t border-stone-200/60" />
                <div className="glass-card rounded-2xl p-5 space-y-4">
                    <div className="text-center">
                        <p className="text-sm font-bold text-stone-700 mb-1">
                            {shareToken ? "この診断結果を保存・共有できます" : "診断結果をレポートで保存できます"}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Main CTA: Share result */}
                        {shareToken && (
                            <button
                                onClick={handleShareResult}
                                className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition"
                            >
                                {copied ? (
                                    <>
                                        <CheckIcon size={16} />
                                        コピーしました！
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={16} />
                                        この結果を共有する
                                    </>
                                )}
                            </button>
                        )}

                        {/* Email: URL-only when token exists, PDF-attached otherwise */}
                        <button
                            onClick={() => {
                                if (shareToken) {
                                    setDialogMode('email-url');
                                } else {
                                    setDialogMode('email');
                                }
                                setShowNameDialog(true);
                            }}
                            disabled={isGeneratingPdf}
                            className="bg-stone-700 hover:bg-stone-600 active:scale-95 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                        >
                            {isGeneratingPdf && (dialogMode === 'email' || dialogMode === 'email-url') ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    送信中...
                                </>
                            ) : (
                                <>
                                    <Mail size={16} />
                                    メールで結果を受け取る
                                </>
                            )}
                        </button>

                        {/* Report save (text link, legacy) */}
                        <button
                            onClick={handleDownloadClick}
                            disabled={isGeneratingPdf}
                            className="text-stone-500 hover:text-stone-700 text-sm font-medium flex items-center justify-center gap-1.5 py-2 transition disabled:opacity-50"
                        >
                            {isGeneratingPdf && dialogMode === 'download' ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-stone-400/30 border-t-stone-500 rounded-full animate-spin" />
                                    生成中...
                                </>
                            ) : (
                                <>
                                    <FileText size={14} />
                                    レポートを保存する
                                </>
                            )}
                        </button>

                        {/* Share site (only when no token — avoids duplication with share result) */}
                        {!shareToken && (
                            <button
                                onClick={handleShareResult}
                                className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition"
                            >
                                <Share2 size={16} />
                                サイトを共有する
                            </button>
                        )}
                    </div>
                    <div className="text-center">
                        <button
                            onClick={() => {
                                if (confirm("診断をやり直しますか？")) navigate("/");
                            }}
                            className="text-xs text-stone-400 underline bg-transparent border-none cursor-pointer hover:text-stone-600 transition-colors"
                        >
                            <RefreshCw size={12} className="inline mr-1" />
                            診断をやり直す
                        </button>
                    </div>
                </div>

                {/* Consent Notice Banner */}
                {formStatus === "none" && !consentAccepted && (
                    <div
                        className="glass-card p-4 md:p-5 rounded-2xl mb-4 mt-6 text-center"
                        role="region"
                        aria-label="データ収集のご協力のお願い"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <BarChart3 size={16} className="text-orange-500" />
                            <p className="text-sm font-bold text-stone-700">
                                診断データの活用にご協力ください
                            </p>
                        </div>
                        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                            みなさんのデータが次の世代の高校選びの
                            <br className="md:hidden" />
                            サポートになります
                        </p>
                        <button
                            onClick={() => {
                                trackEvent("consent_banner_accept");
                                setConsentAccepted(true);
                            }}
                            className="bg-orange-500 hover:bg-orange-400 text-white py-2 px-5 rounded-lg text-sm font-bold transition-colors"
                            aria-label="データ収集に協力する"
                        >
                            協力する
                        </button>
                        <div className="mt-2">
                            <button
                                onClick={() => {
                                    trackEvent("consent_banner_dismiss");
                                    setFormStatus("dismissed");
                                    localStorage.setItem('csf-form-status', 'dismissed');
                                }}
                                className="text-xs text-stone-400 underline bg-transparent border-none cursor-pointer"
                            >
                                今回は見送る
                            </button>
                        </div>
                    </div>
                )}

                <div ref={formRef} id="data-consent-form" tabIndex={-1}>
                    {formStatus === "submitted" && !isRevision ? (
                        <div className="text-center py-4">
                            <p className="text-xs text-stone-400 mb-1">
                                データ収集にご協力いただきました
                            </p>
                            <button
                                onClick={() => setIsRevision(true)}
                                className="text-xs text-orange-400 underline bg-transparent border-none cursor-pointer"
                            >
                                回答を修正・追加する
                            </button>
                        </div>
                    ) : formStatus === "dismissed" && !isRevision ? (
                        <div className="text-center py-4">
                            <p className="text-xs text-stone-400 mb-1">
                                データ収集を見送る設定になっています
                            </p>
                            <button
                                onClick={() => {
                                    setFormStatus("none");
                                    setConsentAccepted(false);
                                    localStorage.removeItem('csf-form-status');
                                }}
                                className="text-xs text-orange-400 underline bg-transparent border-none cursor-pointer"
                            >
                                やはり協力する
                            </button>
                        </div>
                    ) : consentAccepted || (formStatus === "none" && isRevision) ? (
                        <DataConsentForm
                            scores={finalDisplay.scores}
                            role={role}
                            isRevision={isRevision}
                            skipAsk={consentAccepted}
                            onClose={(status) => {
                                setFormStatus(status);
                                setIsRevision(false);
                                setConsentAccepted(false);
                                localStorage.setItem('csf-form-status', status);
                            }}
                        />
                    ) : null}
                </div>

                {/* One Drop Partner Banner */}
                <div ref={oneDropRef} className="mt-12 pt-8 border-t border-stone-200/50 text-center">
                    <p className="text-sm font-bold text-stone-700 mb-4 tracking-wider">
                        誰かに話を聞いてほしいなら・・・
                    </p>

                    <a
                        href="https://onedrop2025.wixsite.com/my-site-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-2 border-orange-500 rounded-lg px-6 py-2 font-bold text-base tracking-widest mb-4 text-stone-700 no-underline transition-all duration-200 hover:bg-orange-500 hover:text-white"
                    >
                        One drop
                    </a>

                    <p className="text-sm text-stone-600 mb-1">
                        広島県東広島市西条町下見303-1
                    </p>
                    <a
                        href="https://maps.app.goo.gl/KF9t6frVCMa8K23J6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-stone-700 text-white rounded px-7 py-1.5 text-xs font-medium no-underline tracking-wider transition-all duration-200 hover:opacity-80 mb-4"
                    >
                        MAP
                    </a>

                    <div className="text-xs text-stone-500 mb-3 leading-relaxed">
                        <p className="font-medium">営業時間</p>
                        <p>月・火・木・金　15:00〜21:00</p>
                        <p>土　10:00〜18:00</p>
                        <p>水・日・祝　休</p>
                    </div>

                    <p className="text-xs text-stone-500 mb-3">
                        お困りごとがあれば、ご相談ください。
                    </p>

                    <a
                        href="https://www.instagram.com/onedrop.2025/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-stone-300 rounded-full px-5 py-2 text-stone-700 text-xs font-medium no-underline transition-all duration-200 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        Instagram
                    </a>

                    <p className="text-[10px] text-stone-400 mt-6">
                        © 2025 One drop. All rights reserved.
                    </p>
                </div>

            </div>



            {/* Report Overlay (desktop fallback) */}
            <ReportOverlay
                isOpen={showReportOverlay}
                imageDataUrl={reportImageDataUrl}
                onClose={() => {
                    setShowReportOverlay(false);
                    setReportImageDataUrl(null);
                }}
            />

            {/* Name Input Dialog */}
            <NameInputDialog
                isOpen={showNameDialog}
                mode={dialogMode}
                name={respondentName}
                onNameChange={setRespondentName}
                onConfirm={handleSaveConfirm}
                onCancel={handlePdfDownloadCancel}
                isLoading={isGeneratingPdf}
            />

            {/* Hidden Printable Report for PDF Generation */}
            <div ref={printableRef} style={{ display: 'none' }}>
                <PrintableReport
                    scores={finalDisplay.scores}
                    knockoutAnswers={finalDisplay.knockoutAnswers || []}
                    respondentType={role}
                    respondentName={respondentName}
                    diagnosisDate={new Date(finalDisplay.timestamp)}
                    answers={finalDisplay.answers}
                />
            </div>
        </div>
    );
};

function AxisAccordionItem({ axis, score, role, isAboveAvg, isOpen, onToggle }: {
    axis: Axis; score: number; role: "child" | "parent"; isAboveAvg: boolean; isOpen: boolean; onToggle: () => void;
}) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-white/60"
            >
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-stone-700 block truncate">
                        {axis.shortDescription}
                    </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full ${i < Math.round(score) ? (isAboveAvg ? 'bg-amber-400' : 'bg-stone-400') : 'bg-stone-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-stone-500 w-6 text-right">{score.toFixed(1)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
                <div className="px-4 pb-4 space-y-3">
                    <p className="text-sm text-stone-600 leading-relaxed">
                        {role === 'child'
                            ? isAboveAvg ? `「${axis.shortDescription}」をとても大切に考えています。` : `「${axis.shortDescription}」へのこだわりは比較的落ち着いています。`
                            : isAboveAvg ? `お子様の学校選びにおいて、${axis.shortDescription}を強く希望されています。` : `それほど${axis.shortDescription}を最優先には考えていないようです。`
                        }
                    </p>
                    <p className="text-xs text-stone-400">{axis.definition}</p>
                    <div className="bg-orange-50/60 rounded-xl p-3 border border-orange-100/50">
                        <h4 className="text-xs font-bold text-orange-700 mb-2 flex items-center gap-1 tracking-wide">
                            オープンスクールで聞くべきこと
                        </h4>
                        <ul className="space-y-1.5">
                            {axis.osChecklist.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultPage;