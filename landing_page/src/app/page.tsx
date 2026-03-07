import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import SchoolOptionsSection from "@/components/SchoolOptionsSection";
import FutoshokuSection from "@/components/FutoshokuSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollArrow from "@/components/ScrollArrow";
import SectionWrapper from "@/components/SectionWrapper";
import SnapSection from "@/components/SnapSection";
import ScrollIndicator from "@/components/ScrollIndicator";
import BackToTop from "@/components/BackToTop";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import AccessibilityToggle from "@/components/AccessibilityToggle";

export default function Home() {
    return (
        <main id="main-content">
            <ScrollProgressBar />
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
                    <IntroSection />
                </SnapSection>

                <ScrollArrow />

                {/* ── セクション3: About（使い方・想い・データ収集） ── */}
                <SnapSection allowScroll>
                    <AboutSection />
                </SnapSection>

                <ScrollArrow />

                {/* ── セクション4: Diagnosis ── */}
                <SnapSection allowScroll>
                    <DiagnosisSection />
                </SnapSection>

                <ScrollArrow />

                {/* ── セクション5: School Options ── */}
                <SnapSection>
                    <SchoolOptionsSection />
                </SnapSection>

                <ScrollArrow />

                {/* ── セクション6: 不登校セクション ── */}
                <SnapSection>
                    <FutoshokuSection />
                </SnapSection>

                <ScrollArrow />

                {/* ── セクション7: FAQ（内容が長い可能性あり） ── */}
                <SnapSection allowScroll>
                    <FAQSection />
                </SnapSection>

                <ScrollArrow />

                {/* ── セクション8: Footer ── */}
                <SnapSection>
                    <Footer />
                </SnapSection>
                <BackToTop />
            </div>
            <AccessibilityToggle />
        </main>
    );
}
