import Image from "next/image";

export default function DiagnosisSection() {
    return (
        <section className="py-4 md:py-0">
            <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-10 lg:gap-16 mb-5 md:mb-0">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/Recommend.webp"
                        alt="「おすすめ」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain w-[100px] md:w-[200px] md:h-auto lg:w-[260px]"
                    />
                </div>
                <div className="flex-1 w-full flex flex-col items-center pt-2 md:pt-0">
                    {/* セクション見出し */}
                    <div className="border-b-2 border-accent pb-1 mb-3 md:border-2 md:border-accent md:rounded-md md:px-10 md:py-3 lg:px-14 lg:py-4 font-bold text-[20px] md:text-[26px] lg:text-[30px] tracking-wider md:mb-6 lg:mb-8">
                        通信制高校診断
                    </div>

                    {/* 説明文 */}
                    <div
                        className="text-left md:text-center text-text-sub mb-3 md:mb-8"
                        style={{ lineHeight: 2.0 }}
                    >
                        <p className="text-[14px] md:text-[16px] lg:text-[18px]">
                            10人に1人が通信制高校を選ぶ時代になった今。
                            <br className="hidden md:inline" />
                            私たちは子どもの選択肢をどう考えていけばいいのか。
                        </p>
                        <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] lg:text-[18px]">
                            できるだけ、わが子にあった学校が見つかればと願うのは当たり前のこと。
                            <br className="hidden md:inline" />
                            そんな願いを叶えるお手伝いをするための診断サイトです。
                        </p>
                    </div>

                    {/* CTAボタン */}
                    <a
                        href="https://correspondence-school-finder.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-pulse inline-flex items-center justify-center gap-1.5 bg-accent text-white w-full py-3.5 md:w-auto md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg text-[16px] md:text-[20px] lg:text-[22px] font-bold tracking-wider no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
                    >
                        診断をはじめる
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6">
                            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
