import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "不登校からの進路選択ガイド | こどもの進路案内所",
    description:
        "不登校の状態から高校進学を考えるとき、どんな選択肢があるか。全日制・通信制・定時制・特別支援学校の特徴と、お子さまの状態に合わせた選び方を整理します。",
    alternates: {
        canonical: "https://kodomo-shinro.jp/guide/futoko-shinro",
    },
};

export default function FutokoShinroPage() {
    return (
        <article>
            <h1
                className="text-2xl md:text-3xl font-bold leading-tight mb-6"
                style={{ color: "rgb(var(--color-text-rgb))" }}
            >
                不登校からの進路選択ガイド
            </h1>
            <p
                className="text-sm leading-relaxed mb-10"
                style={{ color: "rgb(var(--color-text-sub-rgb))" }}
            >
                中学校を休みがちだったり、不登校の状態にあるお子さまの進路を考えるとき、
                「高校に行けるのか」「どんな選択肢があるのか」という不安を感じるのは自然なことです。
                実際には、通学の頻度や形態を柔軟に選べる進路がいくつもあります。
            </p>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    不登校の状態からでも進学できる学校の種類
                </h2>
                <div className="space-y-4">
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>通信制高校</p>
                        <p className="text-sm" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            自宅学習が中心で、登校日数を柔軟に選べます。
                            オンラインで授業を受けられる学校も増えています。
                            心や体の状態に合わせて、段階的に通学を増やすことも可能です。
                        </p>
                    </div>
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>定時制高校</p>
                        <p className="text-sm" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            夕方以降の授業が中心で、朝起きるのが難しい場合に向いています。
                            対面授業があるため、一人で学習を進めるのが不安な方にも適しています。
                        </p>
                    </div>
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>全日制高校（小規模校など）</p>
                        <p className="text-sm" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            朝から通える体調であれば、少人数制の全日制高校も選択肢になります。
                            大規模校が合わなかった場合でも、環境を変えることで通えるようになるケースもあります。
                        </p>
                    </div>
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>特別支援学校</p>
                        <p className="text-sm" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            より手厚い支援のもとで学びたい場合の選択肢です。
                            入学には療育手帳が必要になる場合があります。
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    お子さまの状態から考える選び方
                </h2>
                <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    学校の種類を比較するだけでなく、お子さまの今の状態を整理することが大切です。
                </p>
                <ul
                    className="text-sm space-y-2 leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    <li><strong>外出が難しい場合</strong> ― オンライン中心の通信制高校から始める</li>
                    <li><strong>人との関わりが不安な場合</strong> ― 少人数制の学校や個別対応のあるサポート校を検討する</li>
                    <li><strong>朝が起きられない場合</strong> ― 定時制高校や、登校日を選べる通信制を選ぶ</li>
                    <li><strong>学力に不安がある場合</strong> ― 基礎からの学び直しに対応している学校を確認する</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    焦らなくていい
                </h2>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    不登校の状態から進路を考えるとき、「早く決めなければ」と感じることがあるかもしれません。
                    でも、まずはお子さまの気持ちや優先順位を整理することが最初のステップです。
                    何を大切にしたいか、何が不安なのかを言葉にしてみるだけでも、選択肢がぐっと見えやすくなります。
                </p>
            </section>
        </article>
    );
}
