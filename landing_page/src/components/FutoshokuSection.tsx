"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type FutoshokuItem = {
    id: string;
    title: string;
    summary: string;
    detail: string;
    color: string;
};

const items: FutoshokuItem[] = [
    {
        id: "fulltime",
        title: "全日制高校",
        summary: "小規模・負担の軽い高校向き",
        detail:
            "できれば小規模で負担の軽い高校を選択したい。体調不良がそこまでひどくなく、朝から起きられる場合おすすめ。",
        color: "#6B8E6B",
    },
    {
        id: "parttime",
        title: "定時制高校",
        summary: "朝が苦手・自学が難しい方向き",
        detail:
            "朝起きられないかつ、自分で勉強するのがしんどいと感じる場合おすすめ",
        color: "#7B8FB2",
    },
    {
        id: "correspondence",
        title: "通信制高校",
        summary: "心身の不安が大きい方向き",
        detail:
            "体調面（心と体両方）の不安が大きい場合おすすめ。卒業率やサポート内容を事前に確認することをおすすめします（公立より私立の方が卒業率は高いという現状がある）。",
        color: "#B28B6B",
    },
    {
        id: "special",
        title: "特別支援学校",
        summary: "充実した支援が必要な方向き",
        detail:
            "今後もより充実した支援が必要である場合おすすめ。療育手帳が必須",
        color: "#9B7BB2",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            delay: i * 0.12,
        },
    }),
};

const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
        height: "auto",
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

export default function FutoshokuSection() {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-6 md:py-0">
            {/* ヘッダー: 画像 + タイトル */}
            <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-10 lg:gap-16 mb-6 md:mb-10">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/selection_point.png"
                        alt="「選び方のポイント」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain w-[100px] md:w-[200px] lg:w-[260px]"
                    />
                </div>
                <div className="text-center md:text-left">
                    <p className="text-[10px] md:text-xs text-text-light tracking-[0.15em] mb-1 font-light">
                        Selection Point
                    </p>
                    <h3 className="font-bold text-base md:text-xl lg:text-2xl text-text tracking-wide">
                        不登校状態の場合の
                        <br className="md:hidden" />
                        選び方のポイント
                    </h3>
                    <p className="text-[11px] md:text-xs text-text-light mt-2 leading-relaxed">
                        お子様の状態に合わせた進路選択のヒント
                    </p>
                </div>
            </div>

            {/* アコーディオンカード */}
            <div className="space-y-3 md:space-y-4">
                {items.map((item, i) => {
                    const isOpen = openId === item.id;

                    return (
                        <motion.div
                            key={item.id}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-30px" }}
                        >
                            <button
                                onClick={() => toggle(item.id)}
                                className="w-full text-left rounded-xl border border-border/40 bg-white/30 backdrop-blur-sm transition-all duration-200 hover:bg-white/50 active:scale-[0.99] overflow-hidden"
                                style={{
                                    borderLeftWidth: "3px",
                                    borderLeftColor: item.color,
                                }}
                            >
                                {/* カードヘッダー */}
                                <div className="flex items-center justify-between px-4 py-3.5 md:px-6 md:py-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span
                                            className="flex-shrink-0 w-2 h-2 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <div className="min-w-0">
                                            <span className="block font-semibold text-[13px] md:text-sm text-text tracking-wide">
                                                {item.title}
                                            </span>
                                            <span className="block text-[11px] md:text-xs text-text-light mt-0.5 truncate">
                                                {item.summary}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 展開アイコン */}
                                    <motion.span
                                        className="flex-shrink-0 ml-3 text-text-light"
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </motion.span>
                                </div>

                                {/* 展開コンテンツ */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            variants={expandVariants}
                                            initial="collapsed"
                                            animate="expanded"
                                            exit="exit"
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 md:px-6 md:pb-5 pt-0">
                                                <div className="border-t border-border/60 pt-3">
                                                    <p
                                                        className="text-[12px] md:text-[13px] text-text-sub"
                                                        style={{ lineHeight: 1.85 }}
                                                    >
                                                        {item.detail}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* フッターメッセージ */}
            <motion.p
                className="text-center font-medium text-sm md:text-base lg:text-lg text-text mt-6 md:mt-10 leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                我が子の学習の不安度・心の状態・
                <br className="md:hidden" />
                生活リズムを整理してみましょう
            </motion.p>
        </section>
    );
}
