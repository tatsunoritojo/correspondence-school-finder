import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "通信制高校の選び方 | こどもの進路案内所",
    description:
        "通信制高校は2025年度時点で全国に332校。通学頻度、費用、サポート体制、進路実績など、学校選びで確認すべきポイントを整理。登録不要の診断ツールで自分の優先順位を可視化できます。",
    alternates: {
        canonical: "https://kodomo-shinro.jp/guide/erabikata",
    },
    openGraph: {
        title: "通信制高校の選び方",
        description:
            "通学頻度、費用、サポート体制、進路実績など、学校選びで確認すべきポイントを整理。",
        url: "https://kodomo-shinro.jp/guide/erabikata",
    },
};

export default function ErabikataPage() {
    return (
        <article>
            <h1
                className="text-2xl md:text-3xl font-bold leading-tight mb-6"
                style={{ color: "rgb(var(--color-text-rgb))" }}
            >
                通信制高校の選び方
            </h1>
            <p
                className="text-sm leading-relaxed mb-10"
                style={{ color: "rgb(var(--color-text-sub-rgb))" }}
            >
                通信制高校は2025年度時点で全国に332校あり、学校ごとに登校頻度、学習方法、費用、進路支援の内容が大きく異なります。
                通信制課程では、添削指導・面接指導・試験を基本とし、学校によってはインターネット等を活用した学習も取り入れています。
                「どこがよいか」を比べる前に、まず「自分は何を優先したいか」を整理することが、学校選びの第一歩です。
            </p>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    確認すべき8つの軸
                </h2>
                <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    通信制高校を選ぶとき、以下の観点を整理しておくと比較しやすくなります。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { title: "通学頻度", desc: "週に何日通いたいか、あるいはまずは少ない登校日数から始めたいか" },
                        { title: "費用", desc: "授業料だけでなく、施設費・教材費・スクーリング交通費・サポート費用まで含めて考える" },
                        { title: "オンライン対応", desc: "自宅学習を中心に進めやすいか、学校での対面支援とのバランスはどうか" },
                        { title: "自己管理", desc: "レポート提出や学習計画を自分で進めやすいか" },
                        { title: "進路実績", desc: "大学進学・専門学校進学・就職など、希望進路に応じた支援があるか" },
                        { title: "学校生活", desc: "行事、部活動、友人関係など、学校での過ごし方をどの程度重視するか" },
                        { title: "メンタルサポート", desc: "相談先や支援体制がどの程度整っているか" },
                        { title: "専門課程", desc: "興味のある分野を学べるコースや活動があるか" },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-lg border p-4"
                            style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}
                        >
                            <p className="text-sm font-bold mb-1" style={{ color: "rgb(var(--color-text-rgb))" }}>
                                {item.title}
                            </p>
                            <p className="text-xs" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    よくある選び方の失敗
                </h2>
                <ul
                    className="text-sm space-y-3 leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    <li>
                        <strong>知名度だけで選ぶ</strong> ―
                        有名な学校でも、登校頻度や学習の進め方、支援体制が合わなければ続けにくくなることがあります。
                    </li>
                    <li>
                        <strong>費用だけで選ぶ</strong> ―
                        授業料が抑えられていても、別途サポート費用や通学・スクーリング費用がかかることがあります。
                    </li>
                    <li>
                        <strong>比較せずに決める</strong> ―
                        同じ通信制でも、通学日数、学習方法、個別支援、進路サポートは大きく異なります。
                    </li>
                </ul>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    まず優先順位を整理する
                </h2>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    学校を比較する前に、「自分にとって何が大切か」を整理するほうが、結果的に学校選びが早く進みます。
                    上で挙げた8つの軸について、どこに重きを置くかを可視化してみてください。
                </p>
            </section>

            {/* 出典・参考資料 */}
            <footer className="mt-12 pt-6 border-t" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                <p className="text-xs mb-3" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                    ※本ページの制度・数値に関する記述は、文部科学省等の公表資料をもとに作成しています。
                    <br />※制度の詳細や出願条件は、各自治体・各学校の公式案内も必ず確認してください。
                    <br />※最終確認日：2026年3月29日
                </p>
                <details className="text-xs" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                    <summary className="cursor-pointer font-medium mb-2 py-1">出典・参考資料</summary>
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
