import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="py-8 pb-10 md:py-0" aria-label="お問い合わせ・所在地情報">
            {/* メインコンテンツ */}
            <div className="text-center">
                {/* One drop ホームページ */}
                <a
                    href="https://onedrop2025.wixsite.com/my-site-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-accent rounded-lg px-6 py-2 md:px-10 md:py-3 font-bold text-base md:text-xl tracking-widest mb-4 md:mb-6 text-text no-underline transition-all duration-200 hover:bg-accent hover:text-white"
                >
                    One drop
                </a>

                {/* 住所 */}
                <p className="text-base md:text-xl font-medium mb-3 md:mb-4">
                    広島県東広島市西条町下見303-1
                </p>

                {/* MAPボタン (ダーク) */}
                <div className="mb-3.5 md:mb-5">
                    <a
                        href="https://maps.app.goo.gl/KF9t6frVCMa8K23J6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-text text-white rounded px-7 py-1.5 md:px-10 md:py-2 text-[15px] md:text-[18px] font-medium no-underline tracking-wider transition-all duration-200 hover:opacity-80"
                    >
                        MAP
                    </a>
                </div>

                {/* 営業時間 */}
                <div
                    className="text-[15px] md:text-[18px] lg:text-[19px] text-text-sub mb-2"
                    style={{ lineHeight: 2 }}
                >
                    <p className="font-medium">営業時間</p>
                    <p>月・火・木・金　15:00〜21:00</p>
                    <p>土　10:00〜18:00</p>
                    <p>水・日・祝　休</p>
                </div>

                {/* 案内テキスト */}
                <p className="text-sm md:text-base text-text-light mb-3 md:mb-5">
                    お困りごとがあれば、ご相談ください。
                </p>

                {/* SNSアイコン */}
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
            </div>

            {/* コピーライト */}
            <p className="text-[10px] md:text-[13px] text-text-light mt-6 md:mt-8 text-center">
                © 2025 One drop. All rights reserved.
            </p>
        </footer>
    );
}
