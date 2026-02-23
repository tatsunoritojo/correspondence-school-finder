"use client";

import { useState } from "react";
import Image from "next/image";

type FutoshokuItem = {
    id: string;
    title: string;
    detail: string;
    color: string;
};

const items: FutoshokuItem[] = [
    {
        id: "fulltime",
        title: "全日制高校",
        detail:
            "朝から通える体調であれば、小規模で負担の少ない全日制高校という選択肢もあります。",
        color: "#6B8E6B",
    },
    {
        id: "parttime",
        title: "定時制高校",
        detail:
            "朝が難しく、自分だけで勉強を進めるのがつらいと感じるお子さまに向いている形です。",
        color: "#7B8FB2",
    },
    {
        id: "correspondence",
        title: "通信制高校",
        detail:
            "心や体の不安が大きいときに、自分のペースで学べる環境です。卒業率やサポート体制は学校ごとに異なるため、事前の確認が大切です（私立の方が卒業率が高い傾向があります）。",
        color: "#B28B6B",
    },
    {
        id: "special",
        title: "特別支援学校",
        detail:
            "より手厚い支援のもとで学びたい場合の選択肢です。入学には療育手帳が必要になります。",
        color: "#9B7BB2",
    },
];

export default function FutoshokuSection() {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-4 md:py-0" aria-label="不登校の場合の選び方">
            <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-10 lg:gap-16">
                {/* イラスト */}
                <div className="flex-shrink-0">
                    <Image
                        src="/images/selection_point.webp"
                        alt="「選び方のポイント」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain w-[100px] md:w-[200px] md:h-auto lg:w-[260px]"
                    />
                </div>

                {/* 右コンテンツ: タイトル + アコーディオン + メッセージ */}
                <div className="flex-1 w-full pt-2 md:pt-0">
                    {/* セクションタイトル */}
                    <div className="mb-3 md:mb-5">
                        <h2 className="font-bold text-[17px] md:text-[22px] lg:text-[26px] text-text tracking-wide">
                            不登校状態の場合の選び方のポイント
                        </h2>
                        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-text-light mt-1 leading-relaxed">
                            それぞれの学校の特徴を、ゆっくり見てみましょう
                        </p>
                    </div>

                    {/* アコーディオンリスト（FAQカード型統一） */}
                    <div className="space-y-3 md:space-y-4">
                        {items.map((item) => {
                            const isOpen = openId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`rounded-lg border transition-colors duration-200 ${
                                        isOpen
                                            ? "bg-white border-accent/30"
                                            : "bg-white border-gray-200"
                                    }`}
                                >
                                    <button
                                        id={`futoshoku-btn-${item.id}`}
                                        onClick={() => toggle(item.id)}
                                        aria-expanded={isOpen}
                                        aria-controls={`futoshoku-panel-${item.id}`}
                                        className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between p-5 md:p-6 text-left gap-4"
                                        style={{
                                            WebkitTapHighlightColor: "transparent",
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                                            <span
                                                className="flex-shrink-0 w-1.5 h-1.5 rounded-full opacity-50"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="font-semibold text-[15px] md:text-[18px] lg:text-[20px] text-text tracking-wide leading-relaxed">
                                                {item.title}
                                            </span>
                                        </div>

                                        {/* 展開アイコン（FAQ統一 ＋/− 型） */}
                                        <span className="flex-shrink-0 w-[28px] h-[28px] md:w-[32px] md:h-[32px] flex items-center justify-center rounded-full border-2 border-accent/40 text-accent text-lg md:text-xl font-bold transition-all duration-200">
                                            {isOpen ? "−" : "＋"}
                                        </span>
                                    </button>

                                    {/* 展開コンテンツ */}
                                    <div
                                        id={`futoshoku-panel-${item.id}`}
                                        role="region"
                                        aria-labelledby={`futoshoku-btn-${item.id}`}
                                        className="overflow-hidden transition-all duration-300"
                                        style={{
                                            maxHeight: isOpen ? "400px" : "0px",
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                    >
                                        <div className="px-5 pb-5 md:px-6 md:pb-6">
                                            <div className="bg-[#fafafa] rounded-md border-t border-gray-200 pt-4 px-4 pb-4 md:px-5 md:pb-5">
                                                <p className="text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed">
                                                    {item.detail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* フッターメッセージ */}
                    <p className="text-center font-medium text-[12px] md:text-[13px] text-text-sub mt-6 md:mt-8 leading-relaxed">
                        お子さまの学習の不安度・心の状態・生活リズムを、ゆっくり振り返ってみましょう。
                    </p>
                </div>
            </div>
        </section>
    );
}
