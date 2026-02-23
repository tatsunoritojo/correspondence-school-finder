"use client";

import { useState, useEffect } from "react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = document.querySelector(".snap-container");

        const handleScroll = () => {
            const containerScroll = container ? container.scrollTop : 0;
            const windowScroll = window.scrollY;
            setVisible(containerScroll > 300 || windowScroll > 300);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        if (container) {
            container.addEventListener("scroll", handleScroll, { passive: true });
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const scrollToTop = () => {
        const container = document.querySelector(".snap-container");
        if (container && container.scrollTop > 0) {
            container.scrollTo({ top: 0, behavior: "smooth" });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="トップに戻る"
            className={`fixed bottom-6 right-6 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full bg-accent text-white shadow-md flex items-center justify-center transition-all duration-300 hover:opacity-80 active:scale-95 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
        >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 16V4M4 10L10 4L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
