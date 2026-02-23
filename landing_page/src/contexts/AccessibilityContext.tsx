"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

export type AccessibilitySettings = {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    enhancedFocus: boolean;
    underlineLinks: boolean;
};

type AccessibilityContextType = AccessibilitySettings & {
    toggle: (key: keyof AccessibilitySettings) => void;
    enableAll: () => void;
    disableAll: () => void;
    isAnyEnabled: boolean;
};

const defaultSettings: AccessibilitySettings = {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    enhancedFocus: false,
    underlineLinks: false,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
    ...defaultSettings,
    toggle: () => {},
    enableAll: () => {},
    disableAll: () => {},
    isAnyEnabled: false,
});

export function useAccessibility() {
    return useContext(AccessibilityContext);
}

const STORAGE_KEY = "a11y-settings";

const classMap: Record<keyof AccessibilitySettings, string> = {
    highContrast: "a11y-high-contrast",
    reducedMotion: "a11y-reduced-motion",
    largeText: "a11y-large-text",
    enhancedFocus: "a11y-enhanced-focus",
    underlineLinks: "a11y-underline-links",
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] =
        useState<AccessibilitySettings>(defaultSettings);
    const [mounted, setMounted] = useState(false);

    // localStorage + OS設定から初期値を取得
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSettings(JSON.parse(stored));
            } catch {
                // パース失敗時はOS設定にフォールバック
            }
        } else {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const prefersContrast = window.matchMedia(
                "(prefers-contrast: more)"
            ).matches;
            if (prefersReducedMotion || prefersContrast) {
                setSettings((prev) => ({
                    ...prev,
                    reducedMotion: prefersReducedMotion,
                    highContrast: prefersContrast,
                }));
            }
        }
        setMounted(true);
    }, []);

    // CSSクラスの同期 + localStorage永続化
    useEffect(() => {
        if (!mounted) return;
        const html = document.documentElement;
        (Object.keys(classMap) as (keyof AccessibilitySettings)[]).forEach(
            (key) => {
                html.classList.toggle(classMap[key], settings[key]);
            }
        );
        const anyEnabled = Object.values(settings).some(Boolean);
        html.classList.toggle("a11y-active", anyEnabled);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings, mounted]);

    const toggle = useCallback((key: keyof AccessibilitySettings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const enableAll = useCallback(() => {
        setSettings({
            highContrast: true,
            reducedMotion: true,
            largeText: true,
            enhancedFocus: true,
            underlineLinks: true,
        });
    }, []);

    const disableAll = useCallback(() => {
        setSettings(defaultSettings);
    }, []);

    const isAnyEnabled = Object.values(settings).some(Boolean);

    return (
        <AccessibilityContext.Provider
            value={{
                ...settings,
                toggle,
                enableAll,
                disableAll,
                isAnyEnabled,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}
