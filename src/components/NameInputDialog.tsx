import React from 'react';
import { X, FileText, Image, Mail } from 'lucide-react';
import { isMobileDevice } from '../lib/deviceDetection';

export type SaveFormat = 'image' | 'pdf';
export type SaveMode = 'download' | 'email';

interface NameInputDialogProps {
    isOpen: boolean;
    name: string;
    onNameChange: (name: string) => void;
    onConfirm: (format: SaveFormat, mode: SaveMode, email?: string, newsletterOptIn?: boolean) => void;
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

    const [format, setFormat] = React.useState<SaveFormat>(mobile ? 'image' : 'pdf');
    const [mode, setMode] = React.useState<SaveMode>(mobile ? 'email' : 'download');
    const [email, setEmail] = React.useState('');
    const [newsletterOptIn, setNewsletterOptIn] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setEmail('');
            setNewsletterOptIn(false);
            setFormat(mobile ? 'image' : 'pdf');
            setMode(mobile ? 'email' : 'download');
        }
    }, [isOpen, mobile]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(format, mode, mode === 'email' ? email : undefined, mode === 'email' ? newsletterOptIn : undefined);
    };

    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const canSubmit = name.trim()
        && (mode === 'download' || (mode === 'email' && isValidEmail(email)));

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
                    {mode === 'email' ? (
                        <Mail size={28} className="text-orange-500" />
                    ) : (
                        <FileText size={28} className="text-orange-500" />
                    )}
                </div>

                {/* タイトル */}
                <h2 className="text-xl font-bold text-stone-700 text-center mb-2">
                    {mode === 'email' ? 'レポートをメールで受け取る' : '診断結果を保存'}
                </h2>
                <p className="text-sm text-stone-500 text-center mb-6">
                    {mode === 'email'
                        ? 'お名前とメールアドレスを入力してください'
                        : 'レポートに表示するお名前を入力してください'}
                </p>

                {/* フォーム */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="お名前（例: 山田 太郎）"
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl mb-3 focus:border-orange-400 focus:outline-none transition-colors text-stone-700 placeholder:text-stone-300"
                        autoFocus
                        disabled={isLoading}
                    />

                    {/* メールアドレス（email モード時） */}
                    {mode === 'email' && (
                        <>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="メールアドレス"
                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl mb-3 focus:border-orange-400 focus:outline-none transition-colors text-stone-700 placeholder:text-stone-300"
                                disabled={isLoading}
                            />
                            <label className="flex items-start gap-2 mb-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newsletterOptIn}
                                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                                    disabled={isLoading}
                                    className="mt-0.5 accent-orange-500"
                                />
                                <span className="text-xs text-stone-600 leading-relaxed">
                                    進路に関する案内をメールで受け取る
                                </span>
                            </label>
                        </>
                    )}

                    {/* 保存方式切り替え */}
                    <div className="flex gap-2 mb-3">
                        <button
                            type="button"
                            onClick={() => setMode('email')}
                            disabled={isLoading}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                mode === 'email'
                                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                                    : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                            }`}
                        >
                            <Mail size={16} />
                            メール
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('download')}
                            disabled={isLoading}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                mode === 'download'
                                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                                    : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                            }`}
                        >
                            <FileText size={16} />
                            ダウンロード
                        </button>
                    </div>

                    {/* ダウンロードモード時のフォーマット選択 */}
                    {mode === 'download' && (
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setFormat('image')}
                                disabled={isLoading}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                    format === 'image'
                                        ? 'border-orange-400 bg-orange-50 text-orange-600'
                                        : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                                }`}
                            >
                                <Image size={14} />
                                画像
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormat('pdf')}
                                disabled={isLoading}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                    format === 'pdf'
                                        ? 'border-orange-400 bg-orange-50 text-orange-600'
                                        : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                                }`}
                            >
                                <FileText size={14} />
                                PDF
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-stone-400 text-center mb-4">
                        {mode === 'email'
                            ? 'レポート画像をメールでお届けします'
                            : format === 'image'
                                ? 'PNG画像として保存します'
                                : 'PDF文書として保存します'}
                    </p>

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
                            disabled={isLoading || !canSubmit}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {mode === 'email' ? '送信中...' : '生成中...'}
                                </span>
                            ) : mode === 'email' ? (
                                'メールで受け取る'
                            ) : (
                                '保存する'
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-xs text-stone-400 text-center mt-4">
                    {mode === 'email'
                        ? '※ 案内配信を希望された方のみ、今後のご案内先として保存します'
                        : '※ お名前はレポートにのみ使用されます'}
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
