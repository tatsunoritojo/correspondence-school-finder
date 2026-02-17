import Image from "next/image";

export default function DiagnosisSection() {
    return (
        <section className="py-4">
            {/* 上部: イラスト + ラベル */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/Recommend.png"
                        alt="「おすすめ」看板を持つ人物"
                        width={80}
                        height={110}
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="border-2 border-accent rounded-md px-6 py-2 font-bold text-[15px] tracking-wider">
                        通信制高校診断
                    </div>
                    <div className="flex flex-col items-center">
                        <span
                            className="font-hand text-[13px] text-text-sub block mb-1"
                            style={{ transform: "rotate(-5deg)" }}
                        >
                            考えてみよう。
                        </span>
                    </div>
                </div>
            </div>

            {/* 説明文 */}
            <div
                className="text-center mb-6 text-text-sub"
                style={{ lineHeight: 2, fontSize: "13.5px" }}
            >
                <p>
                    10人に1人が通信制高校を選ぶ時代になった今、
                    <br />
                    私たちは子どもの選択肢をどう考えていけばいいのか。
                </p>
                <p className="mt-3">
                    できるだけ、わが子にあった学校が見つかればと願うのは当たり前のこと。
                    <br />
                    そんな願いを叶えるお手伝いをするための診断サイトです。
                </p>
            </div>

            {/* CTAボタン */}
            <div className="text-center">
                <a
                    href="https://correspondence-school-finder.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-accent bg-transparent text-accent px-8 py-3.5 text-[15px] font-bold tracking-wider rounded transition-all duration-250 hover:bg-accent hover:text-white"
                >
                    通信制高校診断をはじめる →
                </a>
            </div>
        </section>
    );
}
