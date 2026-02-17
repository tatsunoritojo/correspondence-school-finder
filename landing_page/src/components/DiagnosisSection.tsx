import Image from "next/image";

export default function DiagnosisSection() {
    return (
        <section className="py-4">
            {/* イラスト左 + コンテンツ右 */}
            <div className="flex items-start gap-3 mb-5">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/Recommend.png"
                        alt="「おすすめ」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain"
                    />
                </div>
                <div className="flex-1 flex flex-col items-center pt-2">
                    {/* セクション見出し（ラベル） */}
                    <div className="border-2 border-accent rounded-md px-6 py-2 font-bold text-[15px] tracking-wider mb-4">
                        通信制高校診断
                    </div>

                    {/* 説明文（コンパクト化） */}
                    <div
                        className="text-center text-text-sub mb-4"
                        style={{ lineHeight: 1.9, fontSize: "13px" }}
                    >
                        <p>
                            10人に1人が通信制高校を
                            <br />
                            選ぶ時代になった今、
                        </p>
                        <p className="mt-1">
                            わが子にあった学校を
                            <br />
                            見つけるお手伝いをします。
                        </p>
                    </div>

                    {/* CTAボタン（明確にボタンと分かるデザイン） */}
                    <a
                        href="https://correspondence-school-finder.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-accent text-white px-6 py-3 rounded-lg text-[14px] font-bold tracking-wider no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                        診断をはじめる
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="ml-0.5"
                        >
                            <path
                                d="M3 8H13M9 4L13 8L9 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
