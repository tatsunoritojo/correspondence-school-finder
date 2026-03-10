import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * deviceDetection.ts のテスト
 *
 * 各関数は navigator.userAgent / window.innerWidth を参照するため、
 * モジュールを毎回リロードして環境をモックする。
 *
 * テスト対象のロジック:
 *   isMobileDevice()   → innerWidth < 768 なら true
 *   isInAppWebView()   → UA に LINE/FBAV/Instagram 等を含む、または iOS で Safari トークンなし
 *   isIOSSafari()      → iOS + Safari + WebView でない
 *   canShareFiles()    → navigator.share と navigator.canShare が両方 function
 *   canOpenNewTab()    → WebView でなければ true
 */

// モジュールを動的にインポートし直すヘルパー
async function loadModule() {
    // vitest のモジュールキャッシュをクリアして再評価
    return await import('./deviceDetection');
}

describe('deviceDetection', () => {
    const originalUA = navigator.userAgent;
    const originalInnerWidth = window.innerWidth;

    function setUA(ua: string) {
        Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
    }

    function setInnerWidth(w: number) {
        Object.defineProperty(window, 'innerWidth', { value: w, configurable: true });
    }

    afterEach(() => {
        Object.defineProperty(navigator, 'userAgent', { value: originalUA, configurable: true });
        Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
        vi.restoreAllMocks();
        vi.resetModules();
    });

    // ─── isMobileDevice ───

    describe('isMobileDevice', () => {
        it('innerWidth < 768 → true（スマホ）', async () => {
            setInnerWidth(375);
            const { isMobileDevice } = await loadModule();
            expect(isMobileDevice()).toBe(true);
        });

        it('innerWidth === 768 → false（タブレット境界）', async () => {
            setInnerWidth(768);
            const { isMobileDevice } = await loadModule();
            expect(isMobileDevice()).toBe(false);
        });

        it('innerWidth > 768 → false（デスクトップ）', async () => {
            setInnerWidth(1024);
            const { isMobileDevice } = await loadModule();
            expect(isMobileDevice()).toBe(false);
        });
    });

    // ─── isInAppWebView ───

    describe('isInAppWebView', () => {
        const webViewUAs: [string, string][] = [
            ['LINE', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Line/14.5.0'],
            ['Facebook (FBAV)', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 FBAV/438.0.0.36.118'],
            ['Facebook (FBAN)', 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 FBAN/FB4A'],
            ['Instagram', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Instagram 312.0.0.0'],
            ['Twitter/X', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Twitter for iPhone'],
            ['iOS WebView (Safari token なし)', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'],
            ['Android WebView', 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 wv)'],
        ];

        it.each(webViewUAs)('%s → true', async (_, ua) => {
            setUA(ua);
            const { isInAppWebView } = await loadModule();
            expect(isInAppWebView()).toBe(true);
        });

        const nonWebViewUAs: [string, string][] = [
            ['iOS Safari', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'],
            ['Android Chrome', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'],
            ['Desktop Chrome', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'],
            ['Desktop Safari', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'],
        ];

        it.each(nonWebViewUAs)('%s → false', async (_, ua) => {
            setUA(ua);
            const { isInAppWebView } = await loadModule();
            expect(isInAppWebView()).toBe(false);
        });
    });

    // ─── isIOSSafari ───

    describe('isIOSSafari', () => {
        it('iPhone + Safari → true', async () => {
            setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
            const { isIOSSafari } = await loadModule();
            expect(isIOSSafari()).toBe(true);
        });

        it('iPad + Safari → true', async () => {
            setUA('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
            const { isIOSSafari } = await loadModule();
            expect(isIOSSafari()).toBe(true);
        });

        it('iPhone + LINE (WebView) → false', async () => {
            setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Line/14.5.0');
            const { isIOSSafari } = await loadModule();
            expect(isIOSSafari()).toBe(false);
        });

        it('Android Chrome → false', async () => {
            setUA('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36');
            const { isIOSSafari } = await loadModule();
            expect(isIOSSafari()).toBe(false);
        });

        it('Desktop Safari → false（iOS デバイスでないため）', async () => {
            setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15');
            const { isIOSSafari } = await loadModule();
            expect(isIOSSafari()).toBe(false);
        });
    });

    // ─── canShareFiles ───

    describe('canShareFiles', () => {
        it('share + canShare が両方あれば true', async () => {
            Object.defineProperty(navigator, 'share', { value: vi.fn(), configurable: true });
            Object.defineProperty(navigator, 'canShare', { value: vi.fn(), configurable: true });
            const { canShareFiles } = await loadModule();
            expect(canShareFiles()).toBe(true);
        });

        it('share がなければ false', async () => {
            Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
            Object.defineProperty(navigator, 'canShare', { value: vi.fn(), configurable: true });
            const { canShareFiles } = await loadModule();
            expect(canShareFiles()).toBe(false);
        });

        it('canShare がなければ false', async () => {
            Object.defineProperty(navigator, 'share', { value: vi.fn(), configurable: true });
            Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });
            const { canShareFiles } = await loadModule();
            expect(canShareFiles()).toBe(false);
        });
    });

    // ─── canOpenNewTab ───

    describe('canOpenNewTab', () => {
        it('通常ブラウザ → true', async () => {
            setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
            const { canOpenNewTab } = await loadModule();
            expect(canOpenNewTab()).toBe(true);
        });

        it('LINE WebView → false', async () => {
            setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Line/14.5.0');
            const { canOpenNewTab } = await loadModule();
            expect(canOpenNewTab()).toBe(false);
        });
    });
});
