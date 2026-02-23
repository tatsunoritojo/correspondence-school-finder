"use client";

import { useState } from "react";
import Image from "next/image";
import { faqCategories } from "@/data/faqData";

export default function FAQSection() {
    const [openIds, setOpenIds] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <section className="py-10 md:py-0" aria-label="よくあるご質問">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10 lg:gap-16">
                {/* イラスト */}
                <div className="flex-shrink-0">
                    <Image
                        src="/images/FAQ.webp"
                        alt="「よくある質問」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain w-[100px] md:w-[200px] md:h-auto lg:w-[260px]"
                    />
                </div>

                {/* FAQ コンテンツ */}
                <div className="flex-1 w-full pt-2 md:pt-0">
                    {/* ① セクションタイトル */}
                    <div className="mb-8 md:mb-10">
                        <h2 className="text-[20px] md:text-[26px] lg:text-[30px] font-bold tracking-wider mb-2 md:mb-3">
                            よくあるご質問
                        </h2>
                        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed">
                            中学生のお子さまの進路に悩む保護者の方から、
                            <br className="hidden md:inline" />
                            特に多く寄せられる質問をまとめました。
                        </p>
                    </div>

                    {/* ② カテゴリ別FAQ */}
                    <div className="space-y-8 md:space-y-10">
                        {faqCategories.map((category) => (
                            <div key={category.label}>
                                {/* カテゴリ見出し */}
                                <div className="bg-[#f0ece4] rounded-md px-4 py-2.5 mb-6">
                                    <span className="text-[15px] md:text-[18px] lg:text-[19px] font-bold text-text tracking-wider">
                                        {category.label}
                                    </span>
                                </div>

                                {/* ③ カード化されたアコーディオン */}
                                <div className="space-y-3 md:space-y-4">
                                    {category.items.map((item) => {
                                        const isOpen = openIds.has(item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                className={`rounded-lg border transition-colors duration-200 ${
                                                    isOpen
                                                        ? "bg-white border-accent/30"
                                                        : "bg-white border-gray-200"
                                                }`}
                                            >
                                                <button
                                                    id={`faq-btn-${item.id}`}
                                                    onClick={() => toggle(item.id)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`faq-panel-${item.id}`}
                                                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between p-5 md:p-6 text-[15px] md:text-[18px] lg:text-[20px] font-semibold text-text text-left gap-4"
                                                    style={{ WebkitTapHighlightColor: "transparent" }}
                                                >
                                                    <span className="leading-relaxed">{item.question}</span>
                                                    <span className="flex-shrink-0 w-[28px] h-[28px] md:w-[32px] md:h-[32px] flex items-center justify-center rounded-full border-2 border-accent/40 text-accent text-lg md:text-xl font-bold transition-all duration-200">
                                                        {isOpen ? "−" : "＋"}
                                                    </span>
                                                </button>

                                                {/* ④ 構造化された回答 */}
                                                <div
                                                    id={`faq-panel-${item.id}`}
                                                    role="region"
                                                    aria-labelledby={`faq-btn-${item.id}`}
                                                    className="overflow-hidden transition-all duration-300"
                                                    style={{
                                                        maxHeight: isOpen ? "600px" : "0px",
                                                        opacity: isOpen ? 1 : 0,
                                                    }}
                                                >
                                                    <div className="px-5 pb-5 md:px-6 md:pb-6">
                                                        <div className="bg-[#fafafa] rounded-md border-t border-gray-200 pt-4 px-4 pb-4 md:px-5 md:pb-5">
                                                            <ul className="space-y-2 mb-4">
                                                                {item.answerPoints.map((point, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex items-start gap-2.5 text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed"
                                                                    >
                                                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-[0.55em]" />
                                                                        <span>{point}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <p className="text-[14px] md:text-[16px] lg:text-[18px] text-text font-medium leading-relaxed pl-4 border-l-[3px] border-accent">
                                                                {item.answerSummary}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ⑥ CTA */}
                    <div className="mt-10 md:mt-12 text-center">
                        <p className="text-[14px] md:text-[16px] text-text-sub mb-4">
                            不安を整理してから学校を探したい方へ
                        </p>
                        <a
                            href="https://correspondence-school-finder.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-pulse inline-flex items-center justify-center gap-1.5 bg-accent text-white px-8 py-3.5 md:px-10 md:py-4 rounded-lg text-[16px] md:text-[20px] font-bold tracking-wider no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
                        >
                            診断をはじめる
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5 md:w-5 md:h-5">
                                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <p className="mt-3 text-[12px] md:text-[13px] text-text-light">
                            会員登録・個人情報の入力は一切不要です
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
