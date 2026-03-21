import React from 'react';
import { X, FileText, Image, Mail } from 'lucide-react';

export type SaveFormat = 'image' | 'pdf';
export type SaveMode = 'download' | 'email' | 'email-url';

interface NameInputDialogProps {
    isOpen: boolean;
    mode: SaveMode;
    name: string;
    onNameChange: (name: string) => void;
    onConfirm: (format: SaveFormat, mode: SaveMode, email?: string, newsletterOptIn?: boolean) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const NameInputDialog: React.FC<NameInputDialogProps> = ({
    isOpen,
    mode,
    name,
    onNameChange,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    const [format, setFormat] = React.useState<SaveFormat>('pdf');
    const [email, setEmail] = React.useState('');
    const [newsletterOptIn, setNewsletterOptIn] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setEmail('');
            setNewsletterOptIn(false);
            setFormat('pdf');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isEmailMode = mode === 'email' || mode === 'email-url';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(format, mode, isEmailMode ? email : undefined, isEmailMode ? newsletterOptIn : undefined);
    };

    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const hasValidName = name.trim().length >= (mode === 'email-url' ? 1 : 2);
    const hasValidEmail = isEmailMode && isValidEmail(email);
    const canSubmit = mode === 'download'
        ? hasValidName
        : hasValidName && hasValidEmail;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-fade-in-up">
                {/* 閉じるボタン */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover-hover:hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                    disabled={isLoading}
                >
                    <X size={16} />
                </button>

                {/* アイコン */}
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    {isEmailMode ? (
                        <Mail size={28} className="text-orange-500" />
                    ) : (
                        <FileText size={28} className="text-orange-500" />
                    )}
                </div>

                {/* タイトル */}
                <h2 className="text-xl font-bold text-stone-700 text-center mb-1">
                    {mode === 'email-url' ? 'メールで結果を受け取る' : isEmailMode ? 'レポートをメールで受け取る' : 'レポートをダウンロード'}
                </h2>
                <p className="text-sm text-stone-500 text-center mb-6">
                    {mode === 'email-url'
                        ? 'お名前とメールアドレスを入力してください'
                        : isEmailMode
                        ? 'お名前とメールアドレスを入力してください'
                        : 'レポートに表示するお名前を入力してください'}
                </p>

                {/* フォーム */}
                <form onSubmit={handleSubmit}>
                    {/* お名前 */}
                    <label className="text-sm font-medium text-stone-600 block mb-1">
                        お名前
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="例：山田 花子"
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl mb-4 focus:border-orange-400 focus:outline-none transition-colors text-stone-700 placeholder:text-stone-300"
                        autoFocus
                        disabled={isLoading}
                    />

                    {isEmailMode ? (
                        <>
                            {/* メールアドレス */}
                            <label className="text-sm font-medium text-stone-600 block mb-1">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@mail.com"
                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl mb-4 focus:border-orange-400 focus:outline-none transition-colors text-stone-700 placeholder:text-stone-300"
                                disabled={isLoading}
                            />

                            {/* メルマガ同意 */}
                            <label className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer mb-2">
                                <input
                                    type="checkbox"
                                    checked={newsletterOptIn}
                                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                                    disabled={isLoading}
                                    className="mt-0.5 w-4 h-4 accent-orange-500 shrink-0"
                                />
                                <span className="text-sm text-stone-600 leading-relaxed">
                                    進路に関するご案内をメールで受け取る
                                </span>
                            </label>
                            <p className="text-xs text-stone-400 mb-5 ml-1">
                                ※ ご案内を希望された方のみ、今後のご案内先として保存します
                            </p>
                        </>
                    ) : (
                        <>
                            {/* ダウンロードフォーマット選択 */}
                            <label className="text-sm font-medium text-stone-600 block mb-2">
                                ファイル形式
                            </label>
                            <div className="flex gap-2 mb-5">
                                <button
                                    type="button"
                                    onClick={() => setFormat('pdf')}
                                    disabled={isLoading}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                                        format === 'pdf'
                                            ? 'border-orange-400 bg-orange-50 text-orange-600'
                                            : 'border-stone-200 bg-white text-stone-500 hover-hover:hover:bg-stone-50'
                                    }`}
                                >
                                    <FileText size={14} />
                                    PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormat('image')}
                                    disabled={isLoading}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                                        format === 'image'
                                            ? 'border-orange-400 bg-orange-50 text-orange-600'
                                            : 'border-stone-200 bg-white text-stone-500 hover-hover:hover:bg-stone-50'
                                    }`}
                                >
                                    <Image size={14} />
                                    画像
                                </button>
                            </div>
                        </>
                    )}

                    {/* ボタン */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-stone-400 hover-hover:hover:text-stone-600 hover-hover:hover:bg-stone-50 transition-colors"
                            disabled={isLoading}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-4 py-3 bg-orange-500 hover-hover:hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !canSubmit}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isEmailMode ? '送信中...' : '生成中...'}
                                </span>
                            ) : mode === 'email-url' ? (
                                '結果URLを送信する'
                            ) : isEmailMode ? (
                                '送信する'
                            ) : (
                                'ダウンロードする'
                            )}
                        </button>
                    </div>

                    {!isEmailMode && (
                        <p className="text-xs text-stone-400 text-center mt-3">
                            ※ お名前はレポートにのみ使用されます
                        </p>
                    )}
                </form>
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
