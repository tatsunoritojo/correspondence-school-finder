import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "通信制高校とサポート校の違い | こどもの進路案内所",
    description:
        "通信制高校とサポート校は何が違う？高卒資格の取り方、費用、サポート内容の違いをわかりやすく整理。お子さまに合う組み合わせの考え方も紹介します。",
    alternates: {
        canonical: "https://kodomo-shinro.jp/guide/support-school",
    },
    openGraph: {
        title: "通信制高校とサポート校の違い",
        description:
            "高卒資格の取り方、費用、サポート内容の違いをわかりやすく整理。",
        url: "https://kodomo-shinro.jp/guide/support-school",
    },
};

export default function SupportSchoolPage() {
    return (
        <article>
            <h1
                className="text-2xl md:text-3xl font-bold leading-tight mb-6"
                style={{ color: "rgb(var(--color-text-rgb))" }}
            >
                通信制高校とサポート校の違い
            </h1>
            <p
                className="text-sm leading-relaxed mb-10"
                style={{ color: "rgb(var(--color-text-sub-rgb))" }}
            >
                「通信制高校」と「サポート校」はよく一緒に語られますが、制度上の位置づけがまったく異なります。
                この違いを知らずに学校を選ぶと、費用や卒業資格で想定外のことが起きることがあります。
            </p>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    制度上の違い
                </h2>

                <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b-2" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <th className="text-left py-3 px-2 font-bold" style={{ color: "rgb(var(--color-text-rgb))" }}></th>
                                <th className="text-left py-3 px-2 font-bold" style={{ color: "rgb(var(--color-text-rgb))" }}>通信制高校</th>
                                <th className="text-left py-3 px-2 font-bold" style={{ color: "rgb(var(--color-text-rgb))" }}>サポート校</th>
                            </tr>
                        </thead>
                        <tbody style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>認可</td>
                                <td className="py-3 px-2">国が認可した正規の学校</td>
                                <td className="py-3 px-2">民間の学習支援施設</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>高卒資格</td>
                                <td className="py-3 px-2">取得できる</td>
                                <td className="py-3 px-2">単独では取得できない</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>就学支援金</td>
                                <td className="py-3 px-2">対象</td>
                                <td className="py-3 px-2">対象外</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>費用目安</td>
                                <td className="py-3 px-2">年間10〜30万円程度（公立はさらに安い）</td>
                                <td className="py-3 px-2">年間30〜100万円程度</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    サポート校は通信制高校と<strong>併用</strong>して利用するのが一般的です。
                    通信制高校で高卒資格を取りながら、日々の学習サポートをサポート校が担う形です。
                    そのため、併用する場合は両方の費用がかかります。
                </p>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    どちらが合っているか
                </h2>
                <div className="space-y-4">
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>
                            通信制高校だけで進める場合
                        </p>
                        <ul className="text-sm space-y-1.5" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            <li>・ 自分でレポートや課題を進められる</li>
                            <li>・ 費用を抑えたい</li>
                            <li>・ 学校側のオンラインサポートで十分</li>
                        </ul>
                    </div>
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>
                            サポート校を併用したほうがよい場合
                        </p>
                        <ul className="text-sm space-y-1.5" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            <li>・ 一人で学習を続けるのが不安</li>
                            <li>・ 定期的に通える場所がほしい</li>
                            <li>・ 個別指導やメンタル面のサポートが必要</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    まず何をすればいいか
                </h2>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    お子さまの学習スタイルや心の状態によって、最適な組み合わせは異なります。
                    まずは通信制高校を選ぶうえで何を優先したいのかを整理してみるのがおすすめです。
                </p>
            </section>
        </article>
    );
}
