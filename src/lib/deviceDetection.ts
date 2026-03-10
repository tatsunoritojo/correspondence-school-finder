/**
 * Device detection utilities
 */

/**
 * Determines if the current device is a mobile device (smartphone or tablet)
 * based on screen width. Devices with width < 768px are considered mobile.
 */
export const isMobileDevice = (): boolean => {
    return window.innerWidth < 768;
};

/**
 * Detects if running inside an in-app WebView (LINE, Instagram, Facebook, X, etc.)
 */
export const isInAppWebView = (): boolean => {
    const ua = navigator.userAgent || '';
    return /Line\/|FBAV|FBAN|Instagram|Twitter|Snapchat|WeChat|MicroMessenger|KAKAOTALK/i.test(ua)
        || ((/iPhone|iPad|iPod/.test(ua)) && !(/Safari/.test(ua)))  // iOS WebView (no Safari token)
        || (/wv\)/.test(ua));  // Android WebView marker
};

/**
 * Detects iOS Safari (not WebView)
 */
export const isIOSSafari = (): boolean => {
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !isInAppWebView();
};

/**
 * Checks if Web Share API supports file sharing
 */
export const canShareFiles = (): boolean => {
    return typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
};

/**
 * Checks if window.open is likely to succeed (not blocked in WebViews)
 * Heuristic: WebViews often block popups regardless of user gesture
 */
export const canOpenNewTab = (): boolean => {
    return !isInAppWebView();
};
