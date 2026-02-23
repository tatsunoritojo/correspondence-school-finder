export default function IntroSection() {
    return (
        <section className="text-left md:text-center py-4 md:py-0" style={{ lineHeight: 2.2 }}>
            <p className="font-bold text-[20px] md:text-[26px] lg:text-[30px] mb-6 md:mb-10 text-center">
                合格できる学校ではなく、続けられる学校を。
            </p>
            <div className="text-[14px] md:text-[16px] lg:text-[18px] text-text-sub space-y-4 md:space-y-6">
                <p>
                    高校受験で、はじめて受験を経験する方も多くいらっしゃると思います。
                    <br className="hidden md:inline" />
                    高校選びはある種、人生のターニングポイントの1つでもあるとも思います。
                    <br className="hidden md:inline" />
                    大切なのは、その子に合った学校を選択すること。
                </p>
                <p>
                    情報不足で、選択を狭められないように。
                    <br className="hidden md:inline" />
                    情報過多で、選択がぶれてしまいすぎないように。
                </p>
                <p>
                    このサイトが、高校選びの相談窓口の1つになることを願っています。
                </p>
            </div>
        </section>
    );
}
