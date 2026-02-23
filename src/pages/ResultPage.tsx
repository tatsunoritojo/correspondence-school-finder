import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { LocalStorageRepository } from "../lib/storage";
import { getPersonalizedAdvice, AIAdvice } from "../lib/gemini";
import { AXES, COMMUTING_LABELS, EXAM_LABELS, TRANSPORTATION_LABELS, SCHEDULE_LABELS } from "../data/constants";
import { Axis, ParentChildData } from "../types";
import RadarChart from "../components/RadarChart";
import ResultCard from "../components/ResultCard";
import PrintableReport from "../components/PrintableReport";
import NameInputDialog from "../components/NameInputDialog";
import { Share2, RefreshCw, MessageCircle, Sparkles, AlertCircle, ChevronDown, ChevronUp, ExternalLink, MapPin, X, ChevronRight, FileText } from "lucide-react";
import { isMobileDevice } from "../lib/deviceDetection";

const ResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const childId = searchParams.get("child_id");
    const role = (searchParams.get("role") as "child" | "parent") || "child";

    const [data, setData] = useState<ParentChildData | null>(null);
    const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [showAllAxes, setShowAllAxes] = useState(false);

    // Scroll Banner State
    const [showFloatBanner, setShowFloatBanner] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);

    // PDF Download State
    const [showNameDialog, setShowNameDialog] = useState(false);
    const [respondentName, setRespondentName] = useState("");
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const resultRef = useRef<HTMLDivElement>(null);
    const printableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (childId) {
            LocalStorageRepository.loadData(childId).then(async (loadedData) => {
                setData(loadedData as any);

                // Generate AI Advice if viewing own result
                const myResult = role === "child" ? loadedData.child : loadedData.parent;
                if (myResult && !aiAdvice && !loadingAdvice) {
                    setLoadingAdvice(true);
                    try {
                        const advice = await getPersonalizedAdvice(myResult.scores, role);
                        setAiAdvice(advice);
                    } finally {
                        setLoadingAdvice(false);
                    }
                }
            });
        }
    }, [childId, role]);

    // Scroll Listener for Floating Banner
    // Scroll Listener
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show banner after scrolling 400px
            if (currentScrollY > 400) {
                setShowFloatBanner(true);
            } else {
                setShowFloatBanner(false);
            }

            // Hide scroll indicator after scrolling 50px
            if (currentScrollY > 50) {
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

    // Sorting and Filtering Logic
    const currentScores = finalDisplay.scores;
    const sortedAxes = [...AXES].sort((a, b) => currentScores[b.id] - currentScores[a.id]);

    const THRESHOLD = 3.5;
    const highScoringAxes = sortedAxes.filter(axis => currentScores[axis.id] >= THRESHOLD);
    const visibleAxes = highScoringAxes.length > 0 ? highScoringAxes : sortedAxes.slice(0, 3);
    const hiddenAxes = sortedAxes.filter(axis => !visibleAxes.includes(axis));


    // PDF Download Handler
    const handlePdfDownloadClick = () => {
        setShowNameDialog(true);
    };

    const handlePdfDownloadConfirm = async () => {
        if (!respondentName.trim()) {
            return;
        }

        setIsGeneratingPdf(true);
        setShowNameDialog(false);

        // Wait for PrintableReport to render
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            if (printableRef.current) {
                // Temporarily show the printable element
                printableRef.current.style.position = 'absolute';
                printableRef.current.style.left = '-9999px';
                printableRef.current.style.display = 'block';

                await new Promise(resolve => setTimeout(resolve, 200));

                const canvas = await html2canvas(printableRef.current, {
                    scale: 2,
                    backgroundColor: '#fff7ed',
                    useCORS: true,
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Fix backdrop-filter issues in html2canvas
                        const glassCards = clonedDoc.querySelectorAll('.glass-card');
                        glassCards.forEach((el) => {
                            (el as HTMLElement).style.backdropFilter = 'none';
                            (el as HTMLElement).style.background = '#fff7ed';
                        });
                    }
                });

                // Mobile: Image save/share
                if (isMobileDevice()) {
                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                    if (!blob) throw new Error('Blob creation failed');

                    const fileName = `診断結果レポート_${respondentName}.png`;
                    const file = new File([blob], fileName, { type: 'image/png' });

                    // Try Web Share API first (Mobile)
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: '通信制高校診断結果',
                                text: `${respondentName}さんの診断結果レポートです。`,
                            });
                            printableRef.current.style.display = 'none';
                            return; // Share succeeded
                        } catch (e) {
                            console.log('Share API canceled or failed, falling back to download', e);
                        }
                    }

                    // Fallback: Download image
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } else {
                    // PC: PDF generation
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdfWidth = 210;
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                    // If content is taller than A4, scale it down
                    if (pdfHeight > 297) {
                        const scaledWidth = (297 * canvas.width) / canvas.height;
                        const xOffset = (210 - scaledWidth) / 2;
                        pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, 297);
                    } else {
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    }

                    pdf.save(`診断結果レポート_${respondentName}.pdf`);
                }

                // Hide the printable element again
                printableRef.current.style.display = 'none';
            }
        } catch (error) {
            console.error('Report generation failed:', error);
            alert(isMobileDevice() ? '画像の保存に失敗しました。' : 'PDFの生成に失敗しました。もう一度お試しください。');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handlePdfDownloadCancel = () => {
        setShowNameDialog(false);
        setRespondentName("");
    };

    const handleShareSite = async () => {
        const siteUrl = "https://kodomo-shinro.jp/";
        const shareText = "こどもの進路案内所 — 中学校卒業後の進路選択を支援するサイトです。通信制高校診断もできます。";

        // モバイル: Web Share API を優先
        if (isMobileDevice() && navigator.share) {
            try {
                await navigator.share({
                    title: "こどもの進路案内所",
                    text: shareText,
                    url: siteUrl,
                });
                return;
            } catch (e) {
                // ユーザーがキャンセルした場合はそのまま終了
                if ((e as DOMException).name === "AbortError") return;
            }
        }

        // PC / フォールバック: クリップボードにコピー
        try {
            await navigator.clipboard.writeText(siteUrl);
            alert("サイトのURLをコピーしました！LINEやメールで共有してください。");
        } catch {
            // clipboard API が使えない場合
            prompt("以下のURLをコピーしてください:", siteUrl);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/30 pb-28 relative">
            <div className="max-w-3xl mx-auto p-6" ref={resultRef}>

                {/* Header */}
                <div className="text-center mb-8 mt-4">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-3 tracking-wider">
                        診断レポート
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-stone-700">
                        {role === "child" ? "あなたの学校選びの軸" : "お子様との価値観診断"}
                    </h1>
                    {data.parent && data.child && (
                        <p className="text-teal-600 font-bold mt-2 flex items-center justify-center gap-1 text-sm bg-teal-50 py-1 px-3 rounded-full inline-flex mx-auto mt-3">
                            <MessageCircle size={14} /> 親子マッチング完了
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

                {/* AI Advisor Section */}
                {loadingAdvice && (
                    <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 border-t-4 border-orange-200 shadow-sm animate-pulse">
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
                    <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 border-t-4 border-orange-300 shadow-lg animate-fade-in-up">
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
                                <span className="text-xs font-bold text-orange-600 block mb-1">あなたの強み</span>
                                <p className="text-sm text-stone-700">{aiAdvice.strengthComment}</p>
                            </div>
                            <div className="bg-stone-100/50 p-4 rounded-xl">
                                <span className="text-xs font-bold text-stone-500 block mb-1">アドバイス</span>
                                <p className="text-sm text-stone-700">{aiAdvice.weaknessComment}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chart Section */}
                <div className="glass-card p-6 rounded-3xl mb-8 relative overflow-hidden shadow-sm">
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

                {/* New Answers Display Section */}
                <div className="mt-8 space-y-6">
                    <h2 className="text-xl font-bold text-stone-700 ml-2 flex items-center gap-2">
                        <FileText size={20} className="text-orange-400" />
                        通学条件・入試項目の希望
                    </h2>
                    <div className="glass-card p-6 rounded-2xl space-y-4">
                        {/* Commuting Distance */}
                        <div>
                            <h3 className="text-sm font-bold text-stone-500 mb-2">通学時間</h3>
                            <p className="text-base text-stone-700 font-medium">
                                {finalDisplay.answers["Q9-1"]
                                    ? COMMUTING_LABELS[finalDisplay.answers["Q9-1"] as string] || "未回答"
                                    : "未回答"}
                            </p>
                        </div>
                        {/* Transportation Method */}
                        <div>
                            <h3 className="text-sm font-bold text-stone-500 mb-2">通学方法の許容範囲</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(finalDisplay.answers["Q11-1"]) && (finalDisplay.answers["Q11-1"] as string[]).length > 0 ? (
                                    (finalDisplay.answers["Q11-1"] as string[]).map((val) => (
                                        <span
                                            key={val}
                                            className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full"
                                        >
                                            {TRANSPORTATION_LABELS[val] || val}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-base text-stone-700 font-medium">未回答</p>
                                )}
                            </div>
                        </div>
                        {/* Schedule Flexibility */}
                        <div>
                            <h3 className="text-sm font-bold text-stone-500 mb-2">登校時間の許容範囲</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(finalDisplay.answers["Q12-1"]) && (finalDisplay.answers["Q12-1"] as string[]).length > 0 ? (
                                    (finalDisplay.answers["Q12-1"] as string[]).map((val) => (
                                        <span
                                            key={val}
                                            className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full"
                                        >
                                            {SCHEDULE_LABELS[val] || val}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-base text-stone-700 font-medium">未回答</p>
                                )}
                            </div>
                        </div>
                        {/* Entrance Exam */}
                        <div>
                            <h3 className="text-sm font-bold text-stone-500 mb-2">希望する入試方法</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(finalDisplay.answers["Q10-1"]) && (finalDisplay.answers["Q10-1"] as string[]).length > 0 ? (
                                    (finalDisplay.answers["Q10-1"] as string[]).map((val) => (
                                        <span
                                            key={val}
                                            className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
                                        >
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

                {/* Details Cards Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-stone-700 ml-2 flex items-center gap-2">
                        <AlertCircle size={20} className="text-orange-400" />
                        {role === "child" ? "あなたが重視しているポイント" : "診断詳細"}
                    </h2>

                    {/* High Priority (Visible) Items */}
                    <div className="space-y-6">
                        {visibleAxes.map((axis: Axis) => (
                            <ResultCard
                                key={axis.id}
                                axis={axis}
                                score={finalDisplay.scores[axis.id]}
                                role={role}
                            />
                        ))}
                    </div>

                    {/* Hidden / Low Priority Items */}
                    {hiddenAxes.length > 0 && (
                        <div className="mt-8">
                            {!showAllAxes ? (
                                <button
                                    onClick={() => setShowAllAxes(true)}
                                    className="w-full py-4 bg-white/50 hover:bg-white rounded-2xl border-2 border-dashed border-stone-300 text-stone-500 font-bold flex items-center justify-center gap-2 transition-all group"
                                >
                                    他の項目も確認する
                                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                </button>
                            ) : (
                                <div className="animate-fade-in-up space-y-6">
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="h-px bg-stone-300 flex-1"></div>
                                        <span className="text-xs font-bold text-stone-400">その他の項目</span>
                                        <div className="h-px bg-stone-300 flex-1"></div>
                                    </div>

                                    {hiddenAxes.map((axis: Axis) => (
                                        <ResultCard
                                            key={axis.id}
                                            axis={axis}
                                            score={finalDisplay.scores[axis.id]}
                                            role={role}
                                        />
                                    ))}

                                    <button
                                        onClick={() => setShowAllAxes(false)}
                                        className="w-full py-3 text-stone-400 hover:text-stone-600 font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                        閉じる
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* One Drop Partner Banner */}
                <div className="mt-12 pt-8 border-t border-stone-200/50">
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100 relative overflow-hidden group">
                        {/* Decorative circle */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold text-xs tracking-wider">
                                <MapPin size={12} />
                                東広島の学習塾
                            </div>
                            <h3 className="text-lg font-bold text-stone-700 mb-2">
                                通信制高校選びや<br className="md:hidden" />学習のサポートなら
                            </h3>
                            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                                メンタル面の不安や、学校のレポート課題に寄り添う「One drop」にご相談ください。
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://onedrop2025.wixsite.com/my-site-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                                >
                                    公式サイトを見る
                                    <ExternalLink size={12} />
                                </a>
                                <a
                                    href="https://www.instagram.com/onedrop.2025/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-pink-50 text-stone-700 hover:text-pink-600 border border-stone-200 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    Instagram
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-stone-400 mt-4">
                        Produced by One drop
                    </p>
                </div>

            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-6 left-0 w-full px-4 z-50 pointer-events-none">
                <div className="max-w-2xl mx-auto glass-card-dark p-3 rounded-2xl shadow-2xl flex justify-between items-center gap-3 pointer-events-auto backdrop-blur-xl bg-stone-800/90 border border-stone-700">
                    <button
                        onClick={handlePdfDownloadClick}
                        disabled={isGeneratingPdf}
                        className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                    >
                        {isGeneratingPdf ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                生成中...
                            </>
                        ) : (
                            <>
                                <FileText size={16} />
                                <span className="hidden md:inline">{isMobileDevice() ? 'レポートを保存・共有' : 'レポートをPDFでダウンロード'}</span>
                                <span className="md:hidden">レポート保存</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleShareSite}
                        className="flex-1 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-500/30"
                    >
                        <Share2 size={16} />
                        <span className="hidden md:inline">サイトを共有する</span>
                        <span className="md:hidden">共有</span>
                    </button>

                    <button
                        onClick={() => {
                            if (confirm("診断をやり直しますか？")) navigate("/");
                        }}
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition"
                        title="最初に戻る"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Slide-in Notification Banner (One Drop) */}
            <div className={`fixed bottom-24 right-4 z-40 transition-all duration-500 transform ${showFloatBanner && !bannerDismissed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-white/95 backdrop-blur-md border border-orange-200 p-4 rounded-2xl shadow-xl max-w-[300px] relative animate-fade-in-up">
                    <button
                        onClick={() => setBannerDismissed(true)}
                        className="absolute -top-2 -left-2 bg-stone-400 text-white rounded-full p-1 hover:bg-stone-500 shadow-sm"
                        aria-label="閉じる"
                    >
                        <X size={12} />
                    </button>
                    <div className="flex items-start gap-3">
                        <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0 mt-1">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-stone-600 mb-1">お困りなら相談してみませんか？</p>
                            <p className="text-[10px] text-stone-500 mb-2 leading-tight">
                                東広島の学習塾「One drop」が、メンタル・学習の悩みをサポートします。
                            </p>
                            <a
                                href="https://onedrop2025.wixsite.com/my-site-1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline"
                            >
                                詳細を見る <ChevronRight size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
        .glass-card-dark {
            background: rgba(41, 37, 36, 0.9); /* stone-800 */
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

            {/* Name Input Dialog */}
            <NameInputDialog
                isOpen={showNameDialog}
                name={respondentName}
                onNameChange={setRespondentName}
                onConfirm={handlePdfDownloadConfirm}
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

export default ResultPage;