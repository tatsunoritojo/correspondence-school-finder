"use client";

import { motion } from "framer-motion";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.2 },
    }),
};

export default function IntroSection() {
    const { reducedMotion } = useAccessibility();
    const Wrapper = reducedMotion ? "div" : motion.div;

    const paragraphs = [
        <>
            高校受験で、はじめて受験を経験する方も多くいらっしゃると思います。
            <br className="hidden md:inline" />
            高校選びはある種、人生のターニングポイントの1つでもあるとも思います。
            <br className="hidden md:inline" />
            大切なのは、その子に合った学校を選択すること。
        </>,
        <>
            情報不足で、選択を狭められないように。
            <br className="hidden md:inline" />
            情報過多で、選択がぶれてしまいすぎないように。
        </>,
        <>このサイトが、高校選びの相談窓口の1つになることを願っています。</>,
    ];

    return (
        <section className="text-left md:text-center py-4 md:py-0" style={{ lineHeight: 2.2 }} aria-label="サイトの紹介">
            <Wrapper
                {...(reducedMotion ? {} : {
                    initial: { opacity: 0, scale: 0.8 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true, margin: "-50px" },
                    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                })}
            >
                <h2 className="font-bold text-[20px] md:text-[26px] lg:text-[30px] mb-6 md:mb-10 text-center">
                    合格できる学校ではなく、続けられる学校を。
                </h2>
            </Wrapper>
            <div className="text-[14px] md:text-[16px] lg:text-[18px] text-text-sub space-y-4 md:space-y-6">
                {paragraphs.map((content, i) => (
                    <Wrapper
                        key={i}
                        {...(reducedMotion ? {} : {
                            custom: i,
                            variants: paragraphVariants,
                            initial: "hidden",
                            whileInView: "show",
                            viewport: { once: true, margin: "-30px" },
                        })}
                    >
                        <p>{content}</p>
                    </Wrapper>
                ))}
            </div>
        </section>
    );
}
