import type { Variants } from "framer-motion";

/* ── 基本フェードインアップ ── */
export const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" },
};

/* ── 遅延付きフェードインアップ ── */
export const fadeInUpDelay = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut", delay },
});

/* ── シンプルフェードイン ── */
export const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8 },
};

/* ── 左からスライドイン ── */
export const slideInLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" },
};

/* ── 右からスライドイン ── */
export const slideInRight = {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" },
};

/* ── stagger コンテナ（Variants 形式） ── */
export const staggerContainer: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

/* ── stagger 子要素 ── */
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

/* ── パルス（注目を引く微動） ── */
export const pulse = {
    animate: {
        scale: [1, 1.03, 1],
        boxShadow: [
            "0 0 0 0 rgba(68,68,68,0)",
            "0 0 0 6px rgba(68,68,68,0.08)",
            "0 0 0 0 rgba(68,68,68,0)",
        ],
    },
    transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
    },
};
