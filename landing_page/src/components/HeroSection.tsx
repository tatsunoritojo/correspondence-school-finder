import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="pt-8 pb-0 flex justify-between items-start">
            <div className="flex-1">
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
            <div className="flex-shrink-0 ml-2 -mt-2 relative">
                {/* ご案内します 吹き出し */}
                <span
                    className="absolute -top-1 -right-2 font-hand text-[11px] text-text-sub"
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
                    width={150}
                    height={140}
                    priority
                    className="object-contain"
                />
            </div>
        </section>
    );
}
