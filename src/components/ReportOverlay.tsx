import React from 'react';
import { X, Share2, Download } from 'lucide-react';

interface ReportOverlayProps {
    isOpen: boolean;
    imageDataUrl: string | null;
    onClose: () => void;
}

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
}

const ReportOverlay: React.FC<ReportOverlayProps> = ({ isOpen, imageDataUrl, onClose }) => {
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState('');

    if (!isOpen || !imageDataUrl) return null;

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        setMessage('');

        try {
            const file = await dataUrlToFile(imageDataUrl, '診断結果レポート.png');

            // ① Web Share API（ファイル共有対応の場合）
            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    title: '診断結果レポート',
                    files: [file],
                });
                setMessage('共有しました');
                return;
            }

            // ② Blob URL + <a download> フォールバック
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setMessage('ダウンロードフォルダに保存しました');
        } catch (err) {
            // ユーザーが共有シートをキャンセルした場合
            if (err instanceof Error && err.name === 'AbortError') {
                setMessage('');
                return;
            }
            setMessage('保存できませんでした。画像を長押しして保存してください。');
            console.error('Save failed:', err);
        } finally {
            setSaving(false);
        }
    };

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

            {/* 下部バー */}
            <div className="flex-shrink-0 px-4 py-3 bg-black/80 backdrop-blur-sm">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            処理中...
                        </>
                    ) : typeof navigator.share === 'function' ? (
                        <>
                            <Share2 size={16} />
                            保存・共有する
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            画像を保存する
                        </>
                    )}
                </button>
                {message && (
                    <p className="text-xs text-white/70 text-center mt-2">{message}</p>
                )}
                <p className="text-xs text-white/40 text-center mt-2">
                    画像を長押しして保存することもできます
                </p>
            </div>
        </div>
    );
};

export default ReportOverlay;
