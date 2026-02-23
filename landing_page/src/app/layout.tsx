import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Kurenaido } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import SkipLink from "@/components/SkipLink";

const notoSansJP = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-sans",
    display: "swap",
});

const zenKurenaido = Zen_Kurenaido({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-hand",
    display: "swap",
});

export const metadata: Metadata = {
    title: "こどもの進路案内所 | One drop",
    description:
        "中学校卒業後の選択肢は1つじゃない。合格できる学校ではなく、続けられる学校を。全日制・通信制・定時制など9種類の進路を紹介。",
    keywords: "進路, 高校選び, 通信制高校, 不登校, 中学生, 保護者, 東広島",
    openGraph: {
        title: "こどもの進路案内所 | One drop",
        description:
            "中学校卒業後の選択肢は1つじゃない。合格できる学校ではなく、続けられる学校を。",
        type: "website",
        locale: "ja_JP",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "EducationalOrganization",
                            name: "One drop",
                            address: {
                                "@type": "PostalAddress",
                                streetAddress: "西条町下見303-1",
                                addressLocality: "東広島市",
                                addressRegion: "広島県",
                                postalCode: "739-0044",
                                addressCountry: "JP",
                            },
                            telephone: "080-1740-4209",
                        }),
                    }}
                />
            </head>
            <body
                className={`${notoSansJP.variable} ${zenKurenaido.variable} font-sans`}
            >
                <AccessibilityProvider>
                    <SkipLink />
                    {children}
                </AccessibilityProvider>
            </body>
        </html>
    );
}
