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
                        width={100}
                        height={140}
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 pt-6">
                    {/* 押してみて。テキスト + 矢印 */}
                    <div className="flex items-center gap-1 self-end mr-4">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="rotate-[200deg]"
                        >
                            <path
                                d="M16 4C12 3 6 5 5 12"
                                stroke="#666"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3 9L5 13L8 10"
                                stroke="#666"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            className="font-hand text-[13px] text-text-sub"
                            style={{ transform: "rotate(-5deg)", display: "inline-block" }}
                        >
                            押してみて。
                        </span>
                    </div>
                    {/* 通信制高校診断ボタン */}
                    <a
                        href="https://correspondence-school-finder.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-accent rounded-md px-6 py-2 font-bold text-[15px] tracking-wider no-underline text-text transition-all duration-200 hover:bg-accent hover:text-white"
                    >
                        通信制高校診断
                    </a>
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
        </section>
    );
}
