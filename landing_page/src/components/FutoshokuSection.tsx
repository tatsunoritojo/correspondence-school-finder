import Image from "next/image";

export default function FutoshokuSection() {
    const items = [
        "全日制高校…できれば小規模で負担の軽い高校を選択したい。体調不良がそこまでひどくなく、朝から起きられる場合おすすめ。",
        "定時制高校…朝起きられないかつ、自分で勉強するのがしんどいと感じる場合おすすめ",
        "通信制高校…体調面（心と体両方）の不安が大きい場合おすすめ。卒業率やサポート内容を事前に確認することをおすすめします（公立より私立の方が卒業率は高いという現状がある）。",
        "特別支援学校…今後もより充実した支援が必要である場合おすすめ。療育手帳が必須",
    ];

    return (
        <section className="py-4 md:py-0">
            <div className="flex items-start md:items-center gap-3 md:gap-10 lg:gap-16">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/selection_point.png"
                        alt="「選び方のポイント」看板を持つ人物"
                        width={140}
                        height={190}
                        className="object-contain md:w-[240px] md:h-auto lg:w-[300px]"
                    />
                </div>
                <div className="flex-1 pt-1 md:pt-0">
                    <p className="font-bold text-sm md:text-xl lg:text-2xl mb-3 md:mb-6">
                        【不登校状態の場合】
                    </p>
                    {items.map((text, i) => (
                        <p
                            key={i}
                            className="text-text-sub mb-2 md:mb-3"
                            style={{ lineHeight: 1.8 }}
                        >
                            <span className="font-bold mr-0.5">★</span>
                            <span className="text-[12.5px] md:text-[16px] lg:text-[17px]">{text}</span>
                        </p>
                    ))}
                    <p className="font-medium text-[13px] md:text-[17px] lg:text-[19px] mt-5 md:mt-8 leading-relaxed">
                        我が子の学習の不安度・心の状態・生活リズムを整理してみましょう
                    </p>
                </div>
            </div>
        </section>
    );
}
