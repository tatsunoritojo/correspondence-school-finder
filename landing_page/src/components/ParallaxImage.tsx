"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useAccessibility } from "@/contexts/AccessibilityContext";

type Props = {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
};

export default function ParallaxImage({ src, alt, width, height, className = "" }: Props) {
    const { reducedMotion } = useAccessibility();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

    if (reducedMotion) {
        return (
            <div className="flex-shrink-0">
                <Image src={src} alt={alt} width={width} height={height} className={className} />
            </div>
        );
    }

    return (
        <div ref={ref} className="flex-shrink-0">
            <motion.div style={{ y }}>
                <Image src={src} alt={alt} width={width} height={height} className={className} />
            </motion.div>
        </div>
    );
}
