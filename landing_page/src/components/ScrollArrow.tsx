"use client";

import { motion } from "framer-motion";

export default function ScrollArrow() {
    return (
        <div className="flex justify-center py-7">
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
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
        </div>
    );
}
