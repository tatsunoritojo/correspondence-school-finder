import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "通信制高校とサポート校の違い | こどもの進路案内所",
    description:
        "通信制高校とサポート校は制度上の位置づけが異なります。高卒資格、就学支援金、費用の考え方の違いをわかりやすく整理。お子さまに合う組み合わせを考えるヒントを紹介します。",
    alternates: {
        canonical: "https://kodomo-shinro.jp/guide/support-school",
    },
    openGraph: {
        title: "通信制高校とサポート校の違い",
        description:
            "高卒資格、就学支援金、費用の考え方の違いをわかりやすく整理。",
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
                通信制高校とサポート校は、よく一緒に語られますが、制度上の位置づけは異なります。
                通信制高校は、学校教育法に基づく高等学校です。単位を修得し卒業要件を満たせば、高等学校卒業資格を取得できます。
                サポート校は、高等学校そのものではなく、通信制高校に在籍する生徒の学習面・生活面を支える施設です。サポート校だけでは高卒資格は取得できません。
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
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>制度上の位置づけ</td>
                                <td className="py-3 px-2">学校教育法に基づく高等学校</td>
                                <td className="py-3 px-2">通信制高校に在籍する生徒を支援する施設</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>高卒資格</td>
                                <td className="py-3 px-2">卒業要件を満たせば取得できる</td>
                                <td className="py-3 px-2">単独では取得できない</td>
                            </tr>
                            <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                                <td className="py-3 px-2 font-medium" style={{ color: "rgb(var(--color-text-rgb))" }}>就学支援金</td>
                                <td className="py-3 px-2">授業料が対象</td>
                                <td className="py-3 px-2">対象外</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    className="text-sm leading-relaxed space-y-3"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    <p>
                        サポート校は、通信制高校とあわせて利用されることがあります。
                        通信制高校で高卒資格の取得を目指しながら、日々の学習や生活面のサポートをサポート校が担う形です。
                        その場合、通信制高校の費用に加えて、サポート校の費用もかかります。
                    </p>
                    <p>
                        費用は、学校の種類、コース、通学頻度、サポート内容によって大きく異なります。
                        授業料だけでなく、施設費、教材費、スクーリング時の交通費、サポート校の費用なども含めて確認することが大切です。
                        なお、通信制高校の授業料は就学支援金の対象となる一方、サポート校の費用は対象外です。
                    </p>
                </div>
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
                            <li>・ レポート提出や学習計画を自分で進められる</li>
                            <li>・ 費用を抑えたい</li>
                            <li>・ 学校側の学習支援やスクーリングで十分と感じる</li>
                        </ul>
                    </div>
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>
                            サポート校の併用を検討する場合
                        </p>
                        <ul className="text-sm space-y-1.5" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            <li>・ 一人で学習を続けることに不安がある</li>
                            <li>・ 定期的に通える場所がほしい</li>
                            <li>・ 個別指導やメンタル面のサポートが必要と感じる</li>
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
                    お子さまの学習スタイルや心の状態によって、適した組み合わせは異なります。
                    まずは通信制高校を選ぶうえで何を優先したいのかを整理してみることが、比較の出発点になります。
                </p>
            </section>

            {/* 出典・参考資料 */}
            <footer className="mt-12 pt-6 border-t" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                <p className="text-xs mb-3" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                    ※本ページの制度に関する記述は、文部科学省等の公表資料をもとに作成しています。
                    <br />※制度の詳細や費用については、各自治体・各学校の公式案内も必ず確認してください。
                    <br />※最終確認日：2026年3月29日
                </p>
                <details className="text-xs" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                    <summary className="cursor-pointer font-medium mb-2">出典・参考資料</summary>
                    <ul className="space-y-1.5 pl-4 list-disc">
                        <li>
                            <a href="https://www.mext.go.jp/content/20251027_mxt_koukou01_000045516_0002.pdf" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70 transition-opacity" style={{ color: "rgb(var(--color-link-rgb))" }}>
                                文部科学省「高等学校教育について」(PDF)
                            </a>
                        </li>
                        <li>
                            <a href="https://www.mext.go.jp/a_menu/shotou/mushouka/1342674.htm" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70 transition-opacity" style={{ color: "rgb(var(--color-link-rgb))" }}>
                                文部科学省「高等学校等就学支援金制度」
                            </a>
                        </li>
                    </ul>
                </details>
            </footer>
        </article>
    );
}
