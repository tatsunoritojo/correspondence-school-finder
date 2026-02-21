"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, pulse } from "@/lib/animations";

export default function DiagnosisSection() {
    return (
        <section className="py-4 md:py-0">
            <div className="flex items-start md:items-center gap-3 md:gap-10 lg:gap-16 mb-5 md:mb-0">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/Recommend.png"
                        alt="「おすすめ」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain w-[100px] md:w-[200px] md:h-auto lg:w-[260px]"
                    />
                </div>
                <div className="flex-1 flex flex-col items-center pt-2 md:pt-0">
                    {/* セクション見出し */}
                    <div className="border-2 border-accent rounded-md px-6 py-2 md:px-10 md:py-3 lg:px-14 lg:py-4 font-bold text-[15px] md:text-[22px] lg:text-[26px] tracking-wider mb-4 md:mb-6 lg:mb-8">
                        通信制高校診断
                    </div>

                    {/* 説明文 */}
                    <div
                        className="text-center text-text-sub mb-4 md:mb-8"
                        style={{ lineHeight: 2.0 }}
                    >
                        <p className="text-[13px] md:text-[17px] lg:text-[19px]">
                            10人に1人が通信制高校を選ぶ時代になった今。
                            <br />
                            私たちは子どもの選択肢を
                            <br className="md:hidden" />
                            どう考えていけばいいのか。
                        </p>
                        <p className="mt-2 md:mt-4 text-[13px] md:text-[17px] lg:text-[19px]">
                            できるだけ、わが子にあった学校が
                            <br className="md:hidden" />
                            見つかればと願うのは当たり前のこと。
                            <br />
                            そんな願いを叶えるお手伝いをする
                            <br className="md:hidden" />
                            ための診断サイトです。
                        </p>
                    </div>

                    {/* CTAボタン */}
                    <motion.a
                        href="https://correspondence-school-finder.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-accent text-white px-6 py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg text-[14px] md:text-[18px] lg:text-[20px] font-bold tracking-wider no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                        animate={pulse.animate}
                        transition={pulse.transition}
                    >
                        診断をはじめる
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6">
                            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
