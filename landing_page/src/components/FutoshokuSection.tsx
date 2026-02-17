import Image from "next/image";

export default function FutoshokuSection() {
    const items = [
        "全日制高校…できれば小規模で負担の軽い高校を選択したい。体調不良がさらにひどくなく、朝から起きれる必要があります。",
        "定時制高校…昼起きられるなら、自分で勉強するのがしんどいと感じる場合にはおすすめ",
        "通信制高校…体調面（心と体両方）の不安が大きい場合おすすめです。卒業率やキャンパス内容を重視することをおすすめします（公立と私立の方の卒業率にちがいあり違いがある）",
        "特別支援学校…一般校より丁寧な支援環境であるが確認できます。療育手帳の必要な場合あり",
    ];

    return (
        <section className="py-4">
            <div className="flex items-start gap-3 mb-5">
                <div className="flex-shrink-0">
                    <Image
                        src="/images/selection_point.png"
                        alt="「選び方のポイント」看板を持つ人物"
                        width={80}
                        height={110}
                        className="object-contain"
                    />
                </div>
                <div className="flex-1 pt-2">
                    <div className="bg-white border border-border rounded-[10px] p-5">
                        <p className="font-bold text-sm mb-3.5 text-center">
                            【不登校状態の場合】
                        </p>
                        {items.map((text, i) => (
                            <p
                                key={i}
                                className="text-text-sub mb-2.5"
                                style={{ fontSize: "12.5px", lineHeight: 1.8 }}
                            >
                                <span className="text-accent font-bold mr-1">★</span>
                                {text}
                            </p>
                        ))}
                        <p className="text-center font-medium text-[13px] mt-4 leading-relaxed">
                            我が子の学習の不安度・心の状態・生活リズムを整理してみましょう
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
