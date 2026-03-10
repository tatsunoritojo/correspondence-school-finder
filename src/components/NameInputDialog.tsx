import React from 'react';
import { X, FileText, Image } from 'lucide-react';
import { isMobileDevice, isInAppWebView } from '../lib/deviceDetection';

// UA判定はセッション中に変わらないのでモジュールスコープで1回だけ評価
const webView = isInAppWebView();

export type SaveFormat = 'image' | 'pdf';

interface NameInputDialogProps {
    isOpen: boolean;
    name: string;
    onNameChange: (name: string) => void;
    onConfirm: (format: SaveFormat) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const NameInputDialog: React.FC<NameInputDialogProps> = ({
    isOpen,
    name,
    onNameChange,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    const mobile = isMobileDevice();

    // モバイル・WebView では画像固定、デスクトップはPDFデフォルト
    const [format, setFormat] = React.useState<SaveFormat>(
        (mobile || webView) ? 'image' : 'pdf'
    );

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(format);
    };

    // WebView ではフォーマット選択を非表示にし画像固定
    const showFormatToggle = !webView;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-fade-in-up">
                {/* 閉じるボタン */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                    disabled={isLoading}
                >
                    <X size={16} />
                </button>

                {/* アイコン */}
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <FileText size={28} className="text-orange-500" />
                </div>

                {/* タイトル */}
                <h2 className="text-xl font-bold text-stone-700 text-center mb-2">
                    {(mobile || webView) ? '診断結果レポートを表示' : '診断結果を保存'}
                </h2>
                <p className="text-sm text-stone-500 text-center mb-6">
                    レポートに表示するお名前を入力してください
                </p>

                {/* フォーム */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="例: 山田 太郎"
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl mb-4 focus:border-orange-400 focus:outline-none transition-colors text-stone-700 placeholder:text-stone-300"
                        autoFocus
                        disabled={isLoading}
                    />

                    {/* 形式選択（WebView以外で表示） */}
                    {showFormatToggle && (
                        <>
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setFormat('image')}
                                    disabled={isLoading}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                        format === 'image'
                                            ? 'border-orange-400 bg-orange-50 text-orange-600'
                                            : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                                    }`}
                                >
                                    <Image size={16} />
                                    画像
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormat('pdf')}
                                    disabled={isLoading}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                        format === 'pdf'
                                            ? 'border-orange-400 bg-orange-50 text-orange-600'
                                            : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                                    }`}
                                >
                                    <FileText size={16} />
                                    PDF
                                </button>
                            </div>
                            <p className="text-xs text-stone-400 text-center mb-4">
                                {format === 'image'
                                    ? 'PNG画像として保存します（カメラロール / ダウンロード）'
                                    : 'PDF文書として保存します'}
                            </p>
                        </>
                    )}

                    {/* WebView時のヒント */}
                    {webView && (
                        <p className="text-xs text-stone-400 text-center mb-4">
                            レポート画像を表示します。長押しまたはスクショで保存できます。
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 border-2 border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                            disabled={isLoading}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !name.trim()}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    生成中...
                                </span>
                            ) : (mobile || webView) ? (
                                'レポートを表示'
                            ) : (
                                '保存する'
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-xs text-stone-400 text-center mt-4">
                    ※ お名前はレポートにのみ使用されます
                </p>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default NameInputDialog;
