/**
 * PC用スクロールインジケーター
 * ヒーローセクション下部に表示、PCのみ
 */
export default function ScrollIndicator() {
    return (
        <div className="scroll-indicator hidden md:flex">
            <span>scroll</span>
            <svg
                width="14"
                height="20"
                viewBox="0 0 14 20"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M7 0 L7 16 M2 12 L7 18 L12 12"
                    stroke="#999"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
