"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { slideInLeft, slideInRight } from "@/lib/animations";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function HeroSection() {
    const { reducedMotion } = useAccessibility();

    const Wrapper = reducedMotion ? "div" : motion.div;
    const leftProps = reducedMotion ? {} : slideInLeft;
    const rightProps = reducedMotion
        ? {}
        : {
              ...slideInRight,
              transition: { ...slideInRight.transition, delay: 0.2 },
          };

    return (
        <section
            className="pt-8 pb-0 flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8 lg:gap-16"
            aria-label="こどもの進路案内所 トップ"
        >
            {/* 左サイド: テキスト */}
            <Wrapper
                className="flex-1 pt-4 md:pt-0 text-center md:text-left"
                {...leftProps}
            >
                <p className="font-hand text-base md:text-xl lg:text-2xl text-text-sub mb-2 md:mb-4">
                    義務教育のその先へ
                </p>
                <h1 className="font-bold leading-tight tracking-wider m-0 text-[38px] md:text-[58px] lg:text-[74px]">
                    こどもの進路
                    <br />
                    案内所
                </h1>
                <p className="mt-6 md:mt-10 text-[17px] md:text-[22px] lg:text-[26px] font-medium leading-relaxed text-center md:text-left">
                    中学校卒業後の選択肢は
                    <br />
                    1つじゃない。
                </p>
            </Wrapper>

            {/* 右サイド: 画像 + ご案内します */}
            <Wrapper
                className="flex-1 flex justify-center md:justify-end a11y-hero-image"
                {...rightProps}
            >
                <div className="relative">
                    <span
                        className="absolute -top-1 -right-1 md:-right-4 font-hand text-[11px] md:text-[15px] lg:text-[17px] text-text-sub"
                        style={{
                            writingMode: "vertical-rl",
                            letterSpacing: "2px",
                        }}
                    >
                        ご案内します
                    </span>
                    <Image
                        src="/images/Introduction.webp"
                        alt="受付の女性イラスト"
                        width={280}
                        height={260}
                        priority
                        className="object-contain max-w-[200px] md:max-w-none md:w-[420px] md:h-auto lg:w-[520px]"
                    />
                </div>
            </Wrapper>
        </section>
    );
}
