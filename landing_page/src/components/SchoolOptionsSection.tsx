"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { schoolOptions } from "@/data/schoolOptions";
import SchoolModal from "./SchoolModal";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function SchoolOptionsSection() {
    const [modalOption, setModalOption] = useState<
        (typeof schoolOptions)[number] | null
    >(null);

    return (
        <section className="py-4 md:py-0">
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

                <motion.div
                    className="flex-1 w-full pt-2 md:pt-0"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-5 mb-4">
                        {schoolOptions.map((opt) => (
                            <motion.button
                                key={opt.id}
                                variants={staggerItem}
                                onClick={() => setModalOption(opt)}
                                aria-label={`${opt.label.replace(/\n/g, "")}の説明を見る`}
                                className="border-[1.5px] md:border-2 border-text-light/40 rounded-lg py-2.5 md:py-4 lg:py-5 px-1 md:px-2 text-sm md:text-lg lg:text-xl font-medium leading-snug text-center whitespace-pre-line min-h-[56px] md:min-h-[80px] lg:min-h-[96px] flex items-center justify-center transition-all duration-200 select-none bg-white shadow-sm hover:-translate-y-px hover:shadow-lg active:scale-[0.97]"
                            >
                                {opt.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* 語彙の整理 */}
            <div className="mt-4 md:mt-6 bg-white/60 border border-border rounded-lg p-4 text-left text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed">
                <p className="font-bold mb-1">【語彙の整理】</p>
                <p>
                    <span className="mr-1">•</span>
                    高卒資格…通信制高校を卒業すると、全日制高校と同じ「高等学校卒業資格」が得られます。学歴としては「高卒」となります。
                </p>
                <p>
                    <span className="mr-1">•</span>
                    高卒扱い…「高卒扱い」という言葉が使われることがありますが、通信制高校の卒業は正式な高校卒業資格です。制度上の違いはありません。
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
