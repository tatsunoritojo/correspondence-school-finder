import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "通信制高校の選び方 | こどもの進路案内所",
    description:
        "通信制高校は全国に200校以上。通学頻度、費用、サポート体制、進路実績など、学校選びで確認すべきポイントを整理。登録不要の診断ツールで自分の優先順位を可視化できます。",
    alternates: {
        canonical: "https://kodomo-shinro.jp/guide/erabikata",
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
                通信制高校は全国に200校以上あり、学校ごとに通学頻度、費用、サポート体制が大きく異なります。
                「どこがいいか」を比較する前に、まず「自分は何を優先したいか」を整理するのが選び方の第一歩です。
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
                        { title: "通学頻度", desc: "週5日通えるか、年数回で十分か" },
                        { title: "費用", desc: "学費の総額と就学支援金の適用範囲" },
                        { title: "オンライン対応", desc: "自宅学習がどこまで可能か" },
                        { title: "自己管理", desc: "課題やレポートを自分で進められるか" },
                        { title: "進路実績", desc: "大学進学・就職のサポートがあるか" },
                        { title: "学校生活", desc: "行事や部活、友人関係を重視するか" },
                        { title: "メンタルサポート", desc: "カウンセラーや相談体制があるか" },
                        { title: "専門課程", desc: "プログラミング・美術・福祉などの専門コース" },
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
                        有名校でも、お子さまの学習スタイルやペースに合わなければ続けるのが難しくなります。
                    </li>
                    <li>
                        <strong>費用だけで選ぶ</strong> ―
                        学費が安くてもサポートが薄ければ、別途サポート校や塾の費用がかかることがあります。
                    </li>
                    <li>
                        <strong>比較せずに決める</strong> ―
                        同じ「通信制」でも、通学日数、オンライン対応、個別指導の有無はまったく異なります。
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
        </article>
    );
}
