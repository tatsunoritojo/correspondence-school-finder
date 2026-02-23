"use client";

import { useState, useEffect, useRef } from "react";
import {
    useAccessibility,
    type AccessibilitySettings,
} from "@/contexts/AccessibilityContext";

const settingItems: {
    key: keyof AccessibilitySettings;
    label: string;
    description: string;
}[] = [
    {
        key: "highContrast",
        label: "ハイコントラスト",
        description: "背景を黒、文字を白にして見やすくします",
    },
    {
        key: "reducedMotion",
        label: "アニメーション停止",
        description: "すべての動きを止めて読みやすくします",
    },
    {
        key: "largeText",
        label: "文字拡大",
        description: "ページ全体の文字を大きくします",
    },
    {
        key: "enhancedFocus",
        label: "フォーカス強調",
        description: "キーボード操作時に現在位置を太枠で表示します",
    },
    {
        key: "underlineLinks",
        label: "リンク下線",
        description: "リンクに下線を付けて判別しやすくします",
    },
];

export default function AccessibilityToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const a11y = useAccessibility();
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Escape で閉じる + パネル外クリックで閉じる
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };
        const handleClickOutside = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // フォーカストラップ
    useEffect(() => {
        if (!isOpen || !panelRef.current) return;
        const panel = panelRef.current;
        const getFocusable = () =>
            panel.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

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
    }, [isOpen]);

    const closePanel = () => {
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    return (
        <div className="fixed bottom-6 left-6 z-[999] a11y-toggle-container">
            {/* トグルボタン（アイコン + テキストラベル） */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="アクセシビリティ設定"
                aria-expanded={isOpen}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 shadow-md transition-colors duration-200 ${
                    a11y.isAnyEnabled
                        ? "bg-link text-white"
                        : "bg-white text-text border border-border"
                } hover:opacity-80 active:scale-95`}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="4.5" r="2.5" />
                    <path d="M12 7v5" />
                    <path d="M8 11l4 1 4-1" />
                    <path d="M9 17l3-4 3 4" />
                </svg>
                <span className="text-[13px] font-bold tracking-wide">
                    アクセシビリティ
                </span>
            </button>

            {/* 設定パネル */}
            {isOpen && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-label="アクセシビリティ設定パネル"
                    aria-modal="true"
                    className="absolute bottom-14 left-0 bg-white rounded-xl shadow-xl border border-border p-5"
                    style={{ width: "calc((100vw - 3rem) / var(--a11y-target-zoom))" }}
                >
                    <h3 className="font-bold text-[15px] text-text tracking-wide mb-4">
                        アクセシビリティ設定
                    </h3>

                    {/* マスタートグル */}
                    <button
                        onClick={
                            a11y.isAnyEnabled ? a11y.disableAll : a11y.enableAll
                        }
                        className="w-full flex items-center justify-between bg-bg rounded-lg px-4 py-2.5 mb-4 text-[14px] font-medium text-text transition-colors hover:bg-border/30"
                    >
                        <span>
                            すべて{a11y.isAnyEnabled ? "OFF" : "ON"}
                        </span>
                        <span
                            className={`relative inline-block w-10 h-[22px] rounded-full transition-colors ${
                                a11y.isAnyEnabled ? "bg-link" : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
                                    a11y.isAnyEnabled
                                        ? "translate-x-[18px]"
                                        : ""
                                }`}
                            />
                        </span>
                    </button>

                    <div className="h-px bg-border mb-3" />

                    {/* 個別設定 */}
                    <div className="space-y-3.5">
                        {settingItems.map(({ key, label, description }) => (
                            <div
                                key={key}
                                className="flex items-start justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <span className="text-[13px] font-medium text-text block a11y-setting-label">
                                        {label}
                                    </span>
                                    <span className="text-[11px] text-text-sub leading-snug block mt-0.5 a11y-setting-desc">
                                        {description}
                                    </span>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={a11y[key]}
                                    aria-label={label}
                                    onClick={() => a11y.toggle(key)}
                                    className={`relative flex-shrink-0 w-10 h-[22px] rounded-full transition-colors mt-0.5 ${
                                        a11y[key] ? "bg-link" : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
                                            a11y[key]
                                                ? "translate-x-[18px]"
                                                : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-border mt-3 mb-3" />

                    {/* 閉じるボタン */}
                    <button
                        onClick={closePanel}
                        className="w-full text-center text-[13px] text-text-sub py-1.5 rounded-md hover:bg-bg transition-colors"
                    >
                        閉じる
                    </button>
                </div>
            )}
        </div>
    );
}
