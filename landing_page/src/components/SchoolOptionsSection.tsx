"use client";

import { useState } from "react";
import Image from "next/image";
import { schoolOptions } from "@/data/schoolOptions";
import SchoolModal from "./SchoolModal";

export default function SchoolOptionsSection() {
    const [modalOption, setModalOption] = useState<
        (typeof schoolOptions)[number] | null
    >(null);

    return (
        <section className="py-4">
            {/* 見出しイラスト */}
            <div className="flex justify-center mb-6">
                <Image
                    src="/images/Selection.png"
                    alt="「選択肢一覧」看板を持つ人物"
                    width={80}
                    height={110}
                    className="object-contain"
                />
            </div>

            {/* 3×3 グリッド */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {schoolOptions.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setModalOption(opt)}
                        aria-label={`${opt.label.replace(/\n/g, "")}の説明を見る`}
                        className="border-[1.5px] border-accent rounded-md py-2.5 px-1 text-xs font-medium leading-snug text-center whitespace-pre-line min-h-[56px] flex items-center justify-center transition-all duration-200 select-none hover:-translate-y-px hover:shadow-md active:scale-[0.97]"
                        style={{ background: "#FAF7F2" }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <p className="text-center text-[11px] text-text-light leading-relaxed">
                各ボタンをタップすると説明が表示されます
            </p>

            {/* モーダル */}
            {modalOption && (
                <SchoolModal
                    option={modalOption}
                    onClose={() => setModalOption(null)}
                />
            )}
        </section>
    );
}
