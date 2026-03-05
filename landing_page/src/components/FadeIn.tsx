"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

type Props = {
    children: ReactNode;
    className?: string;
    delay?: number;
    /** y方向の移動量 (default: 24) */
    y?: number;
    /** x方向の移動量 (default: 0) */
    x?: number;
    as?: "div" | "li";
};

export default function FadeIn({
    children,
    className = "",
    delay = 0,
    y = 24,
    x = 0,
    as = "div",
}: Props) {
    const { reducedMotion } = useAccessibility();

    if (reducedMotion) {
        const Tag = as;
        return <Tag className={className}>{children}</Tag>;
    }

    const Component = as === "li" ? motion.li : motion.div;

    return (
        <Component
            initial={{ opacity: 0, y, x }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </Component>
    );
}
