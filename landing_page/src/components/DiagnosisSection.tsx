import Image from "next/image";
import ParallaxImage from "./ParallaxImage";
import AnimatedHeading from "./AnimatedHeading";
import FadeIn from "./FadeIn";

export default function DiagnosisSection() {
    return (
        <section className="py-4 md:py-0" aria-label="通信制高校診断">
            <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-10 lg:gap-16 mb-5 md:mb-0">
                <ParallaxImage
                    src="/images/Recommend.webp"
                    alt="「おすすめ」看板を持つ人物"
                    width={140}
                    height={190}
                    className="object-contain w-[100px] md:w-[200px] md:h-auto lg:w-[260px]"
                />
                <div className="flex-1 w-full flex flex-col items-center pt-2 md:pt-0">
                    {/* セクション見出し */}
                    <AnimatedHeading className="pb-1 mb-3 font-bold text-[20px] md:text-[26px] lg:text-[30px] tracking-wider md:mb-6 lg:mb-8">
                        通信制高校診断
                    </AnimatedHeading>

                    {/* 説明文 */}
                    <FadeIn delay={0.1}>
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
                            <p className="mt-3 md:mt-5 text-[12px] md:text-[14px] lg:text-[15px] text-text-light leading-relaxed">
                                ※ 通信制高校を選びたい方だけでなく、高校選びの価値観を知りたい方にもおすすめです
                            </p>
                        </div>
                    </FadeIn>

                    {/* 診断プレビュー */}
                    <FadeIn delay={0.2} className="mb-4 md:mb-6">
                        <p className="text-[12px] md:text-[14px] text-text-sub font-medium text-center mb-3">
                            こんな結果が見られます
                        </p>
                        <div className="flex justify-center gap-3 md:gap-5">
                            {/* 質問画面モック */}
                            <FadeIn delay={0.25} x={-20} y={20}>
                                <div className="max-w-[150px] md:max-w-[180px] rounded-[2rem] border-[3px] border-stone-700 shadow-xl overflow-hidden bg-white">
                                    <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-2" />
                                    <div className="relative mt-1">
                                        <Image
                                            src="/images/question-preview.png"
                                            alt="診断の質問画面プレビュー"
                                            width={360}
                                            height={640}
                                            className="w-full object-cover object-top h-[200px] md:h-[240px]"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                </div>
                            </FadeIn>
                            {/* 結果画面モック */}
                            <FadeIn delay={0.35} x={20} y={20}>
                                <div className="max-w-[150px] md:max-w-[180px] rounded-[2rem] border-[3px] border-stone-700 shadow-xl overflow-hidden bg-white">
                                    <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-2" />
                                    <div className="relative mt-1">
                                        <Image
                                            src="/images/result-preview.png"
                                            alt="診断の結果画面プレビュー"
                                            width={360}
                                            height={640}
                                            className="w-full object-cover object-top h-[200px] md:h-[240px]"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <p className="text-[12px] md:text-[13px] text-text-light mb-3 md:mb-4 text-center">
                            会員登録・個人情報の入力は一切不要です
                        </p>
                    </FadeIn>

                    {/* CTAボタン */}
                    <FadeIn delay={0.45} y={16}>
                        <a
                            href="https://shindan.kodomo-shinro.jp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-pulse inline-flex items-center justify-center gap-1.5 bg-accent text-white w-full py-3.5 md:w-auto md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg text-[16px] md:text-[20px] lg:text-[22px] font-bold tracking-wider no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
                        >
                            診断をはじめる
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6">
                                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
