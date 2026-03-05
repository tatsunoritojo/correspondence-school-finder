"use client";

import { useState } from "react";
import { aboutItems } from "@/data/aboutData";

export default function AboutSection() {
    const [openIds, setOpenIds] = useState<Set<string>>(
        new Set(["how-to-use"])
    );

    const toggle = (id: string) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <section className="py-4 md:py-0" aria-label="このサイトについて">
            <style jsx>{`
                @keyframes pulse-icon {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                .icon-pulse {
                    animation: pulse-icon 2s ease-in-out 3;
                }
            `}</style>

            <div className="w-full max-w-3xl mx-auto">
                <div className="space-y-3 md:space-y-4">
                    {aboutItems.map((item) => {
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
                                    id={`about-btn-${item.id}`}
                                    onClick={() => toggle(item.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={`about-panel-${item.id}`}
                                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between p-5 md:p-6 text-left gap-4"
                                    style={{
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                >
                                    <span className="font-semibold text-[15px] md:text-[18px] lg:text-[20px] text-text tracking-wide leading-relaxed">
                                        {item.title}
                                    </span>
                                    <span
                                        className={`flex-shrink-0 w-[28px] h-[28px] md:w-[32px] md:h-[32px] flex items-center justify-center rounded-full border-2 border-accent/40 text-accent text-lg md:text-xl font-bold transition-all duration-200 ${
                                            !isOpen ? "icon-pulse" : ""
                                        }`}
                                    >
                                        {isOpen ? "\u2212" : "\uff0b"}
                                    </span>
                                </button>

                                <div
                                    id={`about-panel-${item.id}`}
                                    role="region"
                                    aria-labelledby={`about-btn-${item.id}`}
                                    className="overflow-hidden transition-all duration-300"
                                    style={{
                                        maxHeight: isOpen ? "1200px" : "0px",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <div className="px-5 pb-5 md:px-6 md:pb-6">
                                        <div className="bg-[#fafafa] rounded-md border-t border-gray-200 pt-4 px-4 pb-4 md:px-5 md:pb-5 space-y-4">
                                            {item.sections.map((sec, si) => (
                                                <div key={si}>
                                                    {sec.heading && (
                                                        <p className="text-[14px] md:text-[16px] lg:text-[18px] font-medium text-text mb-2">
                                                            {sec.heading}
                                                        </p>
                                                    )}
                                                    {sec.bullets && (
                                                        <ul className="space-y-2">
                                                            {sec.bullets.map(
                                                                (b, bi) => (
                                                                    <li
                                                                        key={bi}
                                                                        className="flex items-start gap-2.5 text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed"
                                                                    >
                                                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-[0.55em]" />
                                                                        <span>
                                                                            {b}
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                    {sec.text && (
                                                        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed">
                                                            {sec.text}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
