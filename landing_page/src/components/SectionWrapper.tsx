"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInUp } from "@/lib/animations";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function SectionWrapper({ children, className = "" }: Props) {
    return (
        <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
