"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SchoolOption } from "@/data/schoolOptions";

type Props = {
    option: SchoolOption;
    onClose: () => void;
};

export default function SchoolModal({ option, onClose }: Props) {
    const [show, setShow] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // 開く前のフォーカスを保存
        previousFocusRef.current = document.activeElement as HTMLElement;

        requestAnimationFrame(() =>
            requestAnimationFrame(() => setShow(true))
        );
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleClose = useCallback(() => {
        setShow(false);
        setTimeout(() => {
            onClose();
            // フォーカスを復元
            previousFocusRef.current?.focus();
        }, 280);
    }, [onClose]);

    // Escape キーで閉じる
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleClose]);

    // フォーカストラップ
    useEffect(() => {
        if (!show || !panelRef.current) return;
        const panel = panelRef.current;
        const getFocusable = () =>
            panel.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

        // モーダル内にフォーカスを移動
        const focusable = getFocusable();
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const elements = getFocusable();
            if (elements.length === 0) return;
            const first = elements[0];
            const last = elements[elements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        panel.addEventListener("keydown", handleTab);
        return () => panel.removeEventListener("keydown", handleTab);
    }, [show]);

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 school-modal-overlay"
            style={{
                background: show ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
                transition: "background 0.3s ease",
            }}
            onClick={handleClose}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="school-modal-title"
                className="relative w-full max-w-[440px] max-h-[65vh] overflow-y-auto rounded-2xl px-6 pt-8 pb-7"
                style={{
                    background: "rgb(var(--color-bg-light-rgb))",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    opacity: show ? 1 : 0,
                    transform: show
                        ? "scale(1) translateY(0)"
                        : "scale(0.92) translateY(16px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 閉じるボタン */}
                <button
                    onClick={handleClose}
                    aria-label="閉じる"
                    className="absolute top-3 right-3.5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M2 2L16 16M16 2L2 16"
                            stroke="#666"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                {/* 装飾ライン */}
                <div className="w-10 h-[3px] bg-accent rounded-sm mx-auto mb-5" />

                {/* 学校名 */}
                <h3
                    id="school-modal-title"
                    className="text-center font-bold text-[18px] tracking-wider text-text mb-5"
                >
                    {option.label.replace(/\n/g, "")}
                </h3>

                {/* 区切り線 */}
                <div className="h-px bg-border mb-5" />

                {/* 説明文 */}
                <p
                    className="text-[14px] md:text-[16px] text-text-sub text-justify"
                    style={{ lineHeight: 2.1 }}
                >
                    {option.description}
                </p>

                {/* とじるボタン */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleClose}
                        className="border border-border rounded-3xl px-8 py-2 text-xs text-text-light hover:border-text-light hover:text-text-sub transition-all"
                    >
                        とじる
                    </button>
                </div>
            </div>
        </div>
    );
}
