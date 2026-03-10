import React from 'react';
import { X, Share, Camera, Download } from 'lucide-react';
import { isInAppWebView, isIOSSafari } from '../lib/deviceDetection';

// UA判定はセッション中に変わらないのでモジュールスコープで1回だけ評価
const inWebView = isInAppWebView();
const iosSafari = isIOSSafari();

interface ReportOverlayProps {
    isOpen: boolean;
    imageDataUrl: string | null;
    onClose: () => void;
}

const ReportOverlay: React.FC<ReportOverlayProps> = ({ isOpen, imageDataUrl, onClose }) => {
    if (!isOpen || !imageDataUrl) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm flex-shrink-0">
                <h2 className="text-white font-bold text-sm">診断結果レポート</h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Report image (scrollable) */}
            <div className="flex-1 overflow-auto p-4">
                <img
                    src={imageDataUrl}
                    alt="診断結果レポート"
                    className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
                    style={{ WebkitTouchCallout: 'default' }}
                />
            </div>

            {/* Save instructions */}
            <div className="flex-shrink-0 px-4 py-4 bg-white rounded-t-2xl">
                <p className="text-sm font-bold text-stone-700 text-center mb-3">
                    レポートを保存するには
                </p>
                <div className="space-y-2">
                    {inWebView ? (
                        <>
                            <Step
                                icon={<Camera size={16} />}
                                primary
                                text="画像を長押しして「写真に保存」"
                            />
                            <Step
                                icon={<Camera size={16} />}
                                text="または、スクリーンショットで保存"
                            />
                        </>
                    ) : iosSafari ? (
                        <>
                            <Step
                                icon={<Camera size={16} />}
                                primary
                                text="画像を長押しして「写真に追加」"
                            />
                            <Step
                                icon={<Share size={16} />}
                                text="または、共有ボタンから保存"
                            />
                        </>
                    ) : (
                        <>
                            <Step
                                icon={<Download size={16} />}
                                primary
                                text="画像を長押しして保存"
                            />
                            <Step
                                icon={<Camera size={16} />}
                                text="または、スクリーンショットで保存"
                            />
                        </>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-3 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-bold text-stone-600 transition-colors"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
};

function Step({ icon, text, primary }: { icon: React.ReactNode; text: string; primary?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${primary ? 'bg-orange-50 border border-orange-200' : 'bg-stone-50'}`}>
            <span className={`flex-shrink-0 ${primary ? 'text-orange-500' : 'text-stone-400'}`}>{icon}</span>
            <span className={`text-sm ${primary ? 'font-bold text-stone-700' : 'text-stone-500'}`}>{text}</span>
        </div>
    );
}

export default ReportOverlay;
