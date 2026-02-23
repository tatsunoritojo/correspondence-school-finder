import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
    /** trueの場合、内容が長くてもスクロール可能（FAQ等） */
    allowScroll?: boolean;
};

/**
 * PC（md以上）で snap-section として1画面分を占めるラッパー。
 * モバイルでは通常ブロック要素として振る舞う。
 */
export default function SnapSection({
    children,
    className = "",
    allowScroll = false,
}: Props) {
    const sectionClass = allowScroll ? "snap-section--scroll" : "snap-section";

    return (
        <div className={`${sectionClass} ${className}`}>
            <div className="w-full max-w-content md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-5 md:px-12 lg:px-16">
                {children}
            </div>
        </div>
    );
}
