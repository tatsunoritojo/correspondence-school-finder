import { useEffect, type RefObject } from "react";
import { trackEvent } from "../lib/analytics";

export function useTrackView(ref: RefObject<HTMLElement | null>, eventName: string) {
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    trackEvent(eventName);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, eventName]);
}
