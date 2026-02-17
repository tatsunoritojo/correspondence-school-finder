import Image from "next/image";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="py-8 pb-10 text-center">
            {/* Onedropイラスト */}
            <div className="flex justify-center mb-4">
                <Image
                    src="/images/Onedrop.png"
                    alt="「One drop」看板を持つ人物"
                    width={80}
                    height={110}
                    className="object-contain"
                />
            </div>

            {/* ロゴリンク */}
            <a
                href="https://onedrop2025.wixsite.com/my-site-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-accent rounded-lg px-6 py-2 font-bold text-base tracking-widest mb-5 text-text no-underline transition-all duration-200 hover:bg-accent hover:text-white"
            >
                One drop
            </a>

            {/* 住所 */}
            <p className="text-sm font-medium mb-1.5">
                広島県東広島市西条町下見303-1
            </p>

            {/* MAPボタン */}
            <div className="my-3">
                <a
                    href="https://maps.app.goo.gl/KF9t6frVCMa8K23J6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-[1.5px] border-accent rounded px-7 py-1.5 text-[13px] font-medium text-accent no-underline transition-all duration-200 hover:bg-accent hover:text-white"
                >
                    MAP
                </a>
            </div>

            {/* 営業時間 */}
            <div
                className="text-[13px] text-text-sub mb-2"
                style={{ lineHeight: 2 }}
            >
                <p className="font-medium">営業時間</p>
                <p>月・火・木・金　15:00〜21:00</p>
                <p>土　10:00〜18:00</p>
                <p>水・日・祝　休</p>
            </div>

            {/* 案内テキスト */}
            <p className="text-xs text-text-light mb-4">
                お困りごとがあれば、ご相談ください。
            </p>

            {/* SNSアイコン */}
            <div className="flex justify-center gap-4">
                <a
                    href="https://www.instagram.com/onedrop.2025?igsh=MXFrcWxqeGo3OWpzbQ%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-accent opacity-60 hover:opacity-100 transition-opacity"
                >
                    <FaInstagram size={28} />
                </a>
                <a
                    href="https://www.facebook.com/profile.php?id=100022640424045&mibextid=wwXIfr&rdid=5Ao6wYiNrSUQSHjz&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16bLFGu3EF%2F%3Fmibextid%3DwwXIfr#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-accent opacity-60 hover:opacity-100 transition-opacity"
                >
                    <FaFacebookF size={28} />
                </a>
            </div>

            {/* コピーライト */}
            <p className="text-[10px] text-text-light mt-6">
                © 2025 One drop. All rights reserved.
            </p>
        </footer>
    );
}
