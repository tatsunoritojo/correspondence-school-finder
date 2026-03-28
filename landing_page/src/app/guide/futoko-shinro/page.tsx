import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "学校に通いづらいお子さまの進路の選択肢と選び方 | こどもの進路案内所",
    description:
        "学校に通いづらい中学生でも高校に進学できます。通信制・定時制・全日制など、お子さまの状態に合わせた進路の選択肢と選び方を保護者向けに整理。登録不要の診断ツールで優先順位を可視化できます。",
    alternates: {
        canonical: "https://kodomo-shinro.jp/guide/futoko-shinro",
    },
    openGraph: {
        title: "学校に通いづらいお子さまの進路の選択肢と選び方",
        description:
            "通信制・定時制・全日制など、お子さまの状態に合わせた進路の選択肢を整理。",
        url: "https://kodomo-shinro.jp/guide/futoko-shinro",
    },
};

export default function FutokoShinroPage() {
    return (
        <article>
            <h1
                className="text-2xl md:text-3xl font-bold leading-tight mb-6"
                style={{ color: "rgb(var(--color-text-rgb))" }}
            >
                学校に通いづらいお子さまの進路の選択肢
            </h1>
            <p
                className="text-sm leading-relaxed mb-10"
                style={{ color: "rgb(var(--color-text-sub-rgb))" }}
            >
                学校に通いづらい状況にあるお子さまの進路を考えるとき、「高校に進学できるのか」「どの選択肢が合うのか」と不安を抱える家庭は少なくありません。
                進路や学習の遅れへの不安を抱えながらも、今の環境から少し離れてほっとした気持ちを持つお子さまもいます。
                焦って一つに決めるのではなく、今の状態や必要な支援を整理しながら、選択肢を比べていくことが大切です。
            </p>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    登校が難しい状況からでも進学できる学校の種類
                </h2>
                <div className="space-y-4">
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>通信制高校</p>
                        <p className="text-sm" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            通信制課程では、添削指導・面接指導・試験を基本とし、学校によってはインターネット等を活用した学習も取り入れています。
                            登校日数を柔軟に選べる学校が多く、心や体の状態に合わせて段階的に通学を増やすことも可能です。
                        </p>
                    </div>
                    <div className="rounded-lg border p-5" style={{ borderColor: "rgb(var(--color-border-rgb))", backgroundColor: "rgb(var(--color-card-bg-rgb))" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "rgb(var(--color-text-rgb))" }}>定時制高校</p>
                        <p className="text-sm" style={{ color: "rgb(var(--color-text-sub-rgb))" }}>
                            定時制高校は、夜間やその他の特別な時間帯に授業を行う課程です。
                            学校によって時間帯や学び方が異なるため、生活リズムや支援体制に合うかを確認することが大切です。
                            対面授業があるため、一人で学習を進めることに不安がある場合にも選択肢になります。
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
                            特別支援学校は、障害の状態や教育的ニーズに応じた支援を受けながら学ぶ選択肢です。
                            対象や出願条件は地域や学校によって異なるため、教育委員会や学校に確認することが大切です。
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
                    学校の種類を比較するだけでなく、お子さまの今の状態と必要な支援を整理することが大切です。
                </p>
                <ul
                    className="text-sm space-y-2 leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    <li><strong>外出が難しい場合</strong> ― 登校日数が少ない通信制高校や、自宅学習を中心に進められる学校から検討する</li>
                    <li><strong>人との関わりに不安がある場合</strong> ― 少人数制の学校や個別対応のあるサポート校を検討する</li>
                    <li><strong>生活リズムに課題がある場合</strong> ― 定時制高校や、登校日を選べる通信制高校を選択肢に入れる</li>
                    <li><strong>学力に不安がある場合</strong> ― 基礎からの学び直しに対応している学校があるか確認する</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2
                    className="text-lg md:text-xl font-bold mb-4"
                    style={{ color: "rgb(var(--color-text-rgb))" }}
                >
                    焦らず、整理するところから
                </h2>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgb(var(--color-text-sub-rgb))" }}
                >
                    登校が難しい状況から進路を考えるとき、「早く決めなければ」と感じることがあるかもしれません。
                    しかし、まずはお子さまの気持ちや状態、必要な支援を整理し、それに合う選択肢を比べていくことが確実な進め方です。
                    何を大切にしたいか、何が不安なのかを言葉にしてみるだけでも、選択肢が見えやすくなります。
                </p>
            </section>

            {/* 出典・参考資料 */}
            <footer className="mt-12 pt-6 border-t" style={{ borderColor: "rgb(var(--color-border-rgb))" }}>
                <p className="text-xs mb-3" style={{ color: "rgb(var(--color-text-light-rgb))" }}>
                    ※本ページの制度に関する記述は、文部科学省等の公表資料をもとに作成しています。
                    <br />※制度の詳細や出願条件は、各自治体・各学校の公式案内も必ず確認してください。
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
                        <li>
                            <a href="https://www.mext.go.jp/content/20211006-mxt_jidou02-000018318-2.pdf" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70 transition-opacity" style={{ color: "rgb(var(--color-link-rgb))" }}>
                                文部科学省「令和2年度不登校児童生徒の実態把握に関する調査報告書」(PDF)
                            </a>
                        </li>
                    </ul>
                </details>
            </footer>
        </article>
    );
}
