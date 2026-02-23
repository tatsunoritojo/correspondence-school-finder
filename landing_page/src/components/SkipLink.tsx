export default function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-text focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:text-sm focus:font-bold focus:no-underline"
        >
            メインコンテンツへスキップ
        </a>
    );
}
