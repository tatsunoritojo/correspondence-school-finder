import React from 'react';
import { X } from 'lucide-react';

interface ReportOverlayProps {
    isOpen: boolean;
    imageDataUrl: string | null;
    onClose: () => void;
}

const ReportOverlay: React.FC<ReportOverlayProps> = ({ isOpen, imageDataUrl, onClose }) => {
    if (!isOpen || !imageDataUrl) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* 閉じるボタン（フローティング） */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
            >
                <X size={20} />
            </button>

            {/* レポート画像（全画面スクロール） */}
            <div className="flex-1 overflow-auto">
                <img
                    src={imageDataUrl}
                    alt="診断結果レポート"
                    className="w-full"
                    style={{ WebkitTouchCallout: 'default' }}
                />
            </div>

            {/* 最小限の案内 */}
            <div className="flex-shrink-0 px-4 py-2.5 bg-black/80 backdrop-blur-sm flex items-center justify-between">
                <p className="text-xs text-white/70">
                    スクリーンショットまたは画像を長押しして保存
                </p>
                <button
                    onClick={onClose}
                    className="text-xs text-white/50 hover:text-white/80 px-3 py-1.5 transition-colors"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default ReportOverlay;
