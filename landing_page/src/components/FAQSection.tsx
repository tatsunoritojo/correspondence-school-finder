"use client";

import { useState } from "react";
import Image from "next/image";
import { faqItems } from "@/data/faqData";

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
        <section className="py-4 md:py-0">
            <div className="flex items-start md:items-center gap-3 md:gap-10 lg:gap-16">
                {/* イラスト */}
                <div className="flex-shrink-0">
                    <Image
                        src="/images/FAQ.png"
                        alt="「よくある質問」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain md:w-[240px] md:h-auto lg:w-[300px]"
                    />
                </div>

                {/* Q&A リスト */}
                <div className="flex-1 pt-2 md:pt-0">
                    {faqItems.map((item, i) => {
                        const isOpen = openIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className={
                                    i < faqItems.length - 1 ? "border-b border-border" : ""
                                }
                            >
                                <button
                                    onClick={() => toggle(item.id)}
                                    aria-expanded={isOpen}
                                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between py-3.5 md:py-5 px-1 text-[13px] md:text-[17px] lg:text-[19px] font-semibold text-text text-left gap-2 md:gap-4"
                                    style={{ WebkitTapHighlightColor: "transparent" }}
                                >
                                    <span>{item.question}</span>
                                    <span
                                        className="flex-shrink-0 w-[22px] h-[22px] md:w-[30px] md:h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-border text-base md:text-xl text-text-light transition-transform duration-250"
                                        style={{
                                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{
                                        maxHeight: isOpen ? "400px" : "0px",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <p
                                        className="px-1 pb-3.5 md:pb-5 text-text-sub text-[12.5px] md:text-[15px] lg:text-[17px]"
                                        style={{ lineHeight: 1.9 }}
                                    >
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
