"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

type Props = {
    children: ReactNode;
    className?: string;
    as?: "h2" | "h3";
};

export default function AnimatedHeading({ children, className = "", as: Tag = "h2" }: Props) {
    const { reducedMotion } = useAccessibility();
    const ref = useRef<HTMLHeadingElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (reducedMotion) {
            setInView(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [reducedMotion]);

    return (
        <Tag
            ref={ref}
            className={`heading-underline ${inView ? "in-view" : ""} ${className}`}
        >
            {children}
        </Tag>
    );
}
