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

export default function Home() {
    return (
        <div className="max-w-content mx-auto px-5 min-h-screen">
            {/* Header */}
            <SectionWrapper>
                <Header />
            </SectionWrapper>

            {/* Hero */}
            <SectionWrapper>
                <HeroSection />
            </SectionWrapper>

            <ScrollArrow />

            {/* Intro */}
            <SectionWrapper>
                <IntroSection />
            </SectionWrapper>

            <ScrollArrow />

            {/* Diagnosis */}
            <SectionWrapper>
                <DiagnosisSection />
            </SectionWrapper>

            <ScrollArrow />

            {/* School Options */}
            <SectionWrapper>
                <SchoolOptionsSection />
            </SectionWrapper>

            <ScrollArrow />

            {/* 不登校セクション */}
            <SectionWrapper>
                <FutoshokuSection />
            </SectionWrapper>

            <ScrollArrow />

            {/* FAQ */}
            <SectionWrapper>
                <FAQSection />
            </SectionWrapper>

            <ScrollArrow />

            {/* 誰かに話を聞いてほしいなら */}
            <SectionWrapper>
                <p className="text-center text-[13px] text-text font-bold font-hand py-2 pb-4 tracking-wider">
                    誰かに話を聞いてほしいなら・・・
                </p>
            </SectionWrapper>

            {/* Footer */}
            <SectionWrapper>
                <Footer />
            </SectionWrapper>
        </div>
    );
}
