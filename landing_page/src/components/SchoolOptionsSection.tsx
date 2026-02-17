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
            {/* イラスト左 + グリッド右 */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/Selection.png"
                        alt="「選択肢一覧」看板を持つ人物"
                        width={100}
                        height={140}
                        className="object-contain"
                    />
                </div>

                {/* 3×3 グリッド */}
                <div className="flex-1 pt-2">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {schoolOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setModalOption(opt)}
                                aria-label={`${opt.label.replace(/\n/g, "")}の説明を見る`}
                                className="border-[1.5px] border-border rounded-lg py-2.5 px-1 text-xs font-medium leading-snug text-center whitespace-pre-line min-h-[56px] flex items-center justify-center transition-all duration-200 select-none bg-white hover:-translate-y-px hover:shadow-md active:scale-[0.97]"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 語彙の整理 */}
            <div className="mt-4 text-center text-[11.5px] text-text-sub leading-relaxed">
                <p className="font-bold mb-1">【語彙の整理】</p>
                <p>
                    <span className="mr-1">•</span>
                    高卒資格…学歴として高校卒業（高卒）となります。
                </p>
                <p>
                    <span className="mr-1">•</span>
                    高卒扱い…
                </p>
            </div>

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
