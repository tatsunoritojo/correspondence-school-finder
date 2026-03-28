import Link from "next/link";

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "rgb(var(--color-bg-rgb))" }}>
            {/* Header */}
            <header className="border-b border-gray-200/50 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-sm font-bold tracking-wide hover:opacity-70 transition-opacity"
                        style={{ color: "rgb(var(--color-text-rgb))" }}
                    >
                        こどもの進路案内所
                    </Link>
                    <Link
                        href="https://shindan.kodomo-shinro.jp/"
                        className="text-xs px-4 py-2 rounded-full border-2 font-bold transition-colors hover:opacity-80"
                        style={{
                            borderColor: "rgb(var(--color-accent-rgb))",
                            color: "rgb(var(--color-accent-rgb))",
                        }}
                    >
                        診断をはじめる
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-5 py-10 md:py-16">
                {children}
            </main>

            {/* CTA */}
            <section className="border-t border-gray-200/50 py-12 md:py-16">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <p
                        className="text-lg md:text-xl font-bold mb-3"
                        style={{ color: "rgb(var(--color-text-rgb))" }}
                    >
                        自分に合う学校選びのヒントを見つけませんか？
                    </p>
                    <p
                        className="text-sm mb-6"
                        style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                    >
                        登録不要・資料請求なし。21問の診断であなたの優先順位を可視化します。
                    </p>
                    <Link
                        href="https://shindan.kodomo-shinro.jp/"
                        className="inline-block px-8 py-3 rounded-full text-white font-bold text-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "rgb(var(--color-accent-rgb))" }}
                    >
                        通信制高校診断をはじめる（登録不要）
                    </Link>
                </div>
            </section>

            {/* Related Guides */}
            <nav className="border-t border-gray-200/50 py-10">
                <div className="max-w-3xl mx-auto px-5">
                    <p
                        className="text-xs font-bold mb-4 tracking-wide"
                        style={{ color: "rgb(var(--color-text-light-rgb))" }}
                    >
                        関連ガイド
                    </p>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/guide/support-school" className="text-sm hover:underline" style={{ color: "rgb(var(--color-link-rgb))" }}>
                                通信制高校とサポート校の違い
                            </Link>
                        </li>
                        <li>
                            <Link href="/guide/futoko-shinro" className="text-sm hover:underline" style={{ color: "rgb(var(--color-link-rgb))" }}>
                                学校に通いづらいお子さまの進路の選択肢
                            </Link>
                        </li>
                        <li>
                            <Link href="/guide/erabikata" className="text-sm hover:underline" style={{ color: "rgb(var(--color-link-rgb))" }}>
                                通信制高校の選び方
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Footer */}
            <footer className="border-t border-gray-200/50 py-6">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <Link href="/" className="text-xs hover:underline" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                        こどもの進路案内所 トップへ戻る
                    </Link>
                    <p className="text-[10px] mt-2" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                        &copy; 2025 One drop. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
