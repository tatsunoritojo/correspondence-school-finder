"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInUp, fadeInUpDelay } from "@/lib/animations";
import { useAccessibility } from "@/contexts/AccessibilityContext";

type Props = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

export default function SectionWrapper({
    children,
    className = "",
    delay,
}: Props) {
    const { reducedMotion } = useAccessibility();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const anim = delay != null ? fadeInUpDelay(delay) : fadeInUp;

    return (
        <motion.div
            initial={anim.initial}
            whileInView={anim.whileInView}
            viewport={anim.viewport}
            transition={anim.transition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
