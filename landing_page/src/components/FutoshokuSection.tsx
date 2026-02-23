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
            "できれば小規模で負担の軽い高校を選択したい。体調不良がそこまでひどくなく、朝から起きられる場合おすすめ。",
        color: "#6B8E6B",
    },
    {
        id: "parttime",
        title: "定時制高校",
        detail:
            "朝起きられないかつ、自分で勉強するのがしんどいと感じる場合おすすめ",
        color: "#7B8FB2",
    },
    {
        id: "correspondence",
        title: "通信制高校",
        detail:
            "体調面（心と体両方）の不安が大きい場合おすすめ。卒業率やサポート内容を事前に確認することをおすすめします（公立より私立の方が卒業率は高いという現状がある）。",
        color: "#B28B6B",
    },
    {
        id: "special",
        title: "特別支援学校",
        detail:
            "今後もより充実した支援が必要である場合おすすめ。療育手帳が必須",
        color: "#9B7BB2",
    },
];

export default function FutoshokuSection() {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-4 md:py-0">
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
                        <h3 className="font-bold text-[17px] md:text-[22px] lg:text-[26px] text-text tracking-wide">
                            不登校状態の場合の選び方のポイント
                        </h3>
                        <p className="text-[13px] md:text-sm text-text-light mt-1 leading-relaxed">
                            お子様の状態に合わせた進路選択のヒント
                        </p>
                    </div>

                    {/* アコーディオンリスト（FAQ準拠ボーダー区切り型） */}
                    {items.map((item, i) => {
                        const isOpen = openId === item.id;
                        return (
                            <div
                                key={item.id}
                                className={
                                    i < items.length - 1
                                        ? "border-b border-border"
                                        : ""
                                }
                            >
                                <button
                                    onClick={() => toggle(item.id)}
                                    aria-expanded={isOpen}
                                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between py-3 md:py-4 px-1 text-left gap-2 md:gap-4"
                                    style={{
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                                        <span
                                            className="flex-shrink-0 w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <span className="font-semibold text-[15px] md:text-[19px] lg:text-[21px] text-text tracking-wide">
                                            {item.title}
                                        </span>
                                    </div>

                                    {/* 展開アイコン（FAQ統一 +/× 型） */}
                                    <span
                                        className="flex-shrink-0 w-[22px] h-[22px] md:w-[30px] md:h-[30px] flex items-center justify-center rounded-full border-[1.5px] border-border text-base md:text-xl text-text-light transition-transform duration-250"
                                        style={{
                                            transform: isOpen
                                                ? "rotate(45deg)"
                                                : "rotate(0deg)",
                                        }}
                                    >
                                        +
                                    </span>
                                </button>

                                {/* 展開コンテンツ */}
                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{
                                        maxHeight: isOpen ? "400px" : "0px",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <p
                                        className="px-1 pb-3 md:pb-4 text-text-sub text-[14px] md:text-[17px] lg:text-[19px]"
                                        style={{ lineHeight: 1.9 }}
                                    >
                                        {item.detail}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* フッターメッセージ */}
                    <p className="text-center font-medium text-[14px] md:text-base lg:text-lg text-text mt-4 md:mt-6 leading-relaxed">
                        我が子の学習の不安度・心の状態・生活リズムを整理してみましょう
                    </p>
                </div>
            </div>
        </section>
    );
}
