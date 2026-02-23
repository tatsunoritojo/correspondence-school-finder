"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { schoolOptions } from "@/data/schoolOptions";
import SchoolModal from "./SchoolModal";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function SchoolOptionsSection() {
    const [modalOption, setModalOption] = useState<
        (typeof schoolOptions)[number] | null
    >(null);
    const { reducedMotion } = useAccessibility();

    const ContainerWrapper = reducedMotion ? "div" : motion.div;
    const ItemWrapper = reducedMotion ? "button" : motion.button;

    const containerProps = reducedMotion
        ? {}
        : {
              variants: staggerContainer,
              initial: "hidden" as const,
              whileInView: "show" as const,
              viewport: { once: true, margin: "-50px" },
          };

    return (
        <section className="py-4 md:py-0" aria-label="進路の選択肢一覧">
            <h2 className="sr-only">進路の選択肢</h2>
            <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-10 lg:gap-16">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/Selection.webp"
                        alt="「選択肢一覧」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain w-[100px] md:w-[200px] md:h-auto lg:w-[260px]"
                    />
                </div>

                <ContainerWrapper
                    className="flex-1 w-full pt-2 md:pt-0"
                    {...containerProps}
                >
                    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-5 mb-4">
                        {schoolOptions.map((opt) => (
                            <ItemWrapper
                                key={opt.id}
                                {...(reducedMotion
                                    ? {}
                                    : { variants: staggerItem })}
                                onClick={() => setModalOption(opt)}
                                aria-label={`${opt.label.replace(/\n/g, "")}の説明を見る`}
                                className="border-[1.5px] md:border-2 border-text-light/40 rounded-lg py-2.5 md:py-4 lg:py-5 px-1 md:px-2 text-sm md:text-lg lg:text-xl font-medium leading-snug text-center whitespace-pre-line min-h-[56px] md:min-h-[80px] lg:min-h-[96px] flex items-center justify-center transition-all duration-200 select-none bg-white shadow-sm hover:-translate-y-px hover:shadow-lg active:scale-[0.97]"
                            >
                                {opt.label}
                            </ItemWrapper>
                        ))}
                    </div>
                </ContainerWrapper>
            </div>

            {/* 語彙の整理 */}
            <div className="mt-4 md:mt-6 bg-white/60 border border-border rounded-lg p-4 text-left text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed">
                <p className="font-bold mb-1">【語彙の整理】</p>
                <p>
                    <span className="mr-1">•</span>
                    高卒資格…学歴として「高卒」となります。全日制・定時制・通信制高校を卒業すると、高等学校卒業資格を得られます。
                </p>
                <p>
                    <span className="mr-1">•</span>
                    高卒扱い…正式な「高卒資格」ではなく、高校卒業と同等として扱われることを意味します。学歴が「高卒」になるわけではありません。
                </p>
            </div>

            {modalOption && (
                <SchoolModal
                    option={modalOption}
                    onClose={() => setModalOption(null)}
                />
            )}
        </section>
    );
}
