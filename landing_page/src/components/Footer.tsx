"use client";

import { FaInstagram } from "react-icons/fa";
import FadeIn from "./FadeIn";

export default function Footer() {
    return (
        <footer className="py-8 pb-10 md:py-0" aria-label="お問い合わせ・所在地情報">
            <FadeIn>
                <p className="text-center text-[15px] md:text-[17px] text-text font-bold font-hand py-2 pb-4 tracking-wider">
                    誰かに話を聞いてほしいなら・・・
                </p>
            </FadeIn>
            {/* メインコンテンツ */}
            <div className="text-center">
                {/* One drop ホームページ */}
                <FadeIn delay={0.08}>
                    <a
                        href="https://onedrop2025.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-2 border-accent rounded-lg px-6 py-2 md:px-10 md:py-3 font-bold text-base md:text-xl tracking-widest mb-4 md:mb-6 text-text no-underline transition-all duration-200 hover:bg-accent hover:text-white"
                    >
                        One drop
                    </a>
                </FadeIn>

                {/* 住所 */}
                <FadeIn delay={0.16}>
                    <p className="text-base md:text-xl font-medium mb-3 md:mb-4">
                        広島県東広島市西条町下見303-1
                    </p>
                </FadeIn>

                {/* MAPボタン (ダーク) */}
                <FadeIn delay={0.24} className="mb-3.5 md:mb-5">
                    <a
                        href="https://maps.app.goo.gl/KF9t6frVCMa8K23J6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-text text-white rounded px-7 py-1.5 md:px-10 md:py-2 text-[15px] md:text-[18px] font-medium no-underline tracking-wider transition-all duration-200 hover:opacity-80"
                    >
                        MAP
                    </a>
                </FadeIn>

                {/* 営業時間 */}
                <FadeIn delay={0.32}>
                    <div
                        className="text-[15px] md:text-[18px] lg:text-[19px] text-text-sub mb-2"
                        style={{ lineHeight: 2 }}
                    >
                        <p className="font-medium">営業時間</p>
                        <p>月・火・木・金　15:00〜21:00</p>
                        <p>土　10:00〜18:00</p>
                        <p>水・日・祝　休</p>
                    </div>
                </FadeIn>

                {/* 案内テキスト */}
                <FadeIn delay={0.4}>
                    <p className="text-sm md:text-base text-text-light mb-3 md:mb-5">
                        お困りごとがあれば、ご相談ください。
                    </p>
                </FadeIn>

                {/* SNSアイコン */}
                <FadeIn delay={0.48}>
                    <div className="flex justify-center">
                        <a
                            href="https://www.instagram.com/onedrop.2025?igsh=MXFrcWxqeGo3OWpzbQ%3D%3D&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-text text-sm md:text-base font-medium no-underline transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                        >
                            <FaInstagram size={20} className="md:w-6 md:h-6" />
                            Instagram
                        </a>
                    </div>
                </FadeIn>
            </div>

            {/* コピーライト */}
            <FadeIn delay={0.56}>
                <p className="text-[10px] md:text-[13px] text-text-light mt-6 md:mt-8 text-center">
                    © 2025 One drop. All rights reserved.
                </p>
            </FadeIn>
        </footer>
    );
}
