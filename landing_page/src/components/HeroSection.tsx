import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="pt-8 pb-0 flex items-start">
            {/* 左サイド: テキスト */}
            <div className="flex-1 pt-4">
                <p className="font-hand text-sm text-text-sub mb-2">
                    義務教育のその先へ
                </p>
                <h1
                    className="font-black leading-tight tracking-wider m-0"
                    style={{ fontSize: "36px" }}
                >
                    こどもの進路
                    <br />
                    案内所
                </h1>
                <p className="mt-6 text-[15px] font-medium leading-relaxed text-center">
                    中学校卒業後の選択肢は
                    <br />
                    1つじゃない。
                </p>
            </div>

            {/* 右サイド: 画像 + ご案内します */}
            <div className="flex-1 flex justify-end">
                <div className="relative">
                    <span
                        className="absolute -top-1 -right-1 font-hand text-[11px] text-text-sub"
                        style={{
                            writingMode: "vertical-rl",
                            letterSpacing: "2px",
                        }}
                    >
                        ご案内します
                    </span>
                    <Image
                        src="/images/Introduction.png"
                        alt="受付の女性イラスト"
                        width={280}
                        height={260}
                        priority
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
