"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function ScrollArrow() {
    const { reducedMotion } = useAccessibility();

    if (reducedMotion) {
        return (
            <div className="flex justify-center py-7 md:hidden" aria-hidden="true">
                <svg
                    width="18"
                    height="28"
                    viewBox="0 0 18 28"
                    fill="none"
                >
                    <path
                        d="M9 0 L9 24 M2 18 L9 26 L16 18"
                        stroke="#999"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        );
    }

    return (
        /* モバイルのみ表示、PCでは非表示 */
        <div className="flex justify-center py-7 md:hidden">
            <motion.div
                initial={fadeIn.initial}
                whileInView={fadeIn.whileInView}
                viewport={fadeIn.viewport}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                    }}
                >
                    <svg
                        width="18"
                        height="28"
                        viewBox="0 0 18 28"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M9 0 L9 24 M2 18 L9 26 L16 18"
                            stroke="#999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
