"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function ScrollProgressBar() {
    const { reducedMotion } = useAccessibility();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    if (reducedMotion) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-accent/40 origin-left z-[60]"
            style={{ scaleX }}
        />
    );
}
