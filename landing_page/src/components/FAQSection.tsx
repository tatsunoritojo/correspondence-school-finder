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
        <section className="py-4">
            <div className="flex items-start gap-3">
                {/* イラスト */}
                <div className="flex-shrink-0">
                    <Image
                        src="/images/FAQ.png"
                        alt="「よくある質問」看板を持つ人物"
                        width={80}
                        height={110}
                        className="object-contain"
                    />
                </div>

                {/* Q&A リスト */}
                <div className="flex-1 pt-2">
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
                                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between py-3.5 px-1 text-[13px] font-semibold text-text text-left gap-2"
                                    style={{ WebkitTapHighlightColor: "transparent" }}
                                >
                                    <span>{item.question}</span>
                                    <span
                                        className="flex-shrink-0 w-[22px] h-[22px] flex items-center justify-center rounded-full border-[1.5px] border-border text-base text-text-light transition-transform duration-250"
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
                                        maxHeight: isOpen ? "300px" : "0px",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <p
                                        className="px-1 pb-3.5 text-text-sub"
                                        style={{ fontSize: "12.5px", lineHeight: 1.9 }}
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
