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
