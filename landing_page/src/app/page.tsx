import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import SchoolOptionsSection from "@/components/SchoolOptionsSection";
import FutoshokuSection from "@/components/FutoshokuSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollArrow from "@/components/ScrollArrow";
import SectionWrapper from "@/components/SectionWrapper";
import SnapSection from "@/components/SnapSection";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function Home() {
    return (
        <div className="snap-container">
            {/* ── セクション1: Header + Hero ── */}
            <SnapSection>
                <SectionWrapper>
                    <Header />
                </SectionWrapper>
                <SectionWrapper>
                    <HeroSection />
                </SectionWrapper>
                <ScrollIndicator />
            </SnapSection>

            {/* モバイル用矢印 */}
            <ScrollArrow />

            {/* ── セクション2: Intro ── */}
            <SnapSection>
                <SectionWrapper>
                    <IntroSection />
                </SectionWrapper>
            </SnapSection>

            <ScrollArrow />

            {/* ── セクション3: Diagnosis ── */}
            <SnapSection>
                <SectionWrapper>
                    <DiagnosisSection />
                </SectionWrapper>
            </SnapSection>

            <ScrollArrow />

            {/* ── セクション4: School Options ── */}
            <SnapSection>
                <SectionWrapper>
                    <SchoolOptionsSection />
                </SectionWrapper>
            </SnapSection>

            <ScrollArrow />

            {/* ── セクション5: 不登校セクション ── */}
            <SnapSection>
                <SectionWrapper>
                    <FutoshokuSection />
                </SectionWrapper>
            </SnapSection>

            <ScrollArrow />

            {/* ── セクション6: FAQ（内容が長い可能性あり） ── */}
            <SnapSection allowScroll>
                <SectionWrapper>
                    <FAQSection />
                </SectionWrapper>
            </SnapSection>

            <ScrollArrow />

            {/* ── セクション7: Footer ── */}
            <SnapSection>
                <SectionWrapper>
                    <p className="text-center text-[13px] md:text-[15px] text-text font-bold font-hand py-2 pb-4 tracking-wider">
                        誰かに話を聞いてほしいなら・・・
                    </p>
                </SectionWrapper>
                <SectionWrapper delay={0.15}>
                    <Footer />
                </SectionWrapper>
            </SnapSection>
        </div>
    );
}
