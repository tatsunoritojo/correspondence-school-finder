/**
 * レポート保存戦略（全環境統一）
 *
 * UA 判定ではなく、実際の API 実行結果で段階的にフォールバックする。
 * これにより未知の WebView でも必ず保存手段に到達する。
 *
 * フォールバック連鎖:
 *   1. 直接ダウンロード（a.download）→ デスクトップで最速
 *   2. Web Share API（ファイル共有）→ モバイルで最も確実
 *   3. window.open（新タブで画像表示）→ 次善
 *   4. 同一タブオーバーレイ表示 → 最終手段（常に成功）
 */

export type SaveMethod = 'download' | 'webShare' | 'newTab' | 'overlay';

export interface SaveStrategyResult {
    method: SaveMethod;
    success: boolean;
}

export interface SaveActions {
    /** a.download で直接ダウンロードを試みる。成功なら true */
    tryDirectDownload: (blob: Blob) => boolean;
    /** Web Share API でファイルを共有する */
    tryWebShare: (blob: Blob) => Promise<'success' | 'cancelled' | 'failed'>;
    /** 新規タブで Blob URL を開く。成功なら true */
    tryNewTab: (blob: Blob) => boolean;
    /** 同一タブにオーバーレイ表示する（常に成功） */
    showOverlay: (dataUrl: string) => void;
}

/**
 * 実行ベースのフォールバック連鎖。
 * UA 判定には依存せず、各手段を順に試行して最初に成功したもので終了する。
 *
 * @param blob       - レポート画像の Blob（null なら overlay へ直行）
 * @param dataUrl    - レポート画像の dataURL（overlay 用フォールバック）
 * @param actions    - 各保存手段の実行関数（DI でテスト可能にする）
 */
export async function executeSaveStrategy(
    blob: Blob | null,
    dataUrl: string,
    actions: SaveActions,
): Promise<SaveStrategyResult> {
    // 1) 直接ダウンロード（a.download）
    if (blob) {
        const downloaded = actions.tryDirectDownload(blob);
        if (downloaded) {
            return { method: 'download', success: true };
        }
    }

    // 2) Web Share API でファイル共有を試みる
    if (blob) {
        const result = await actions.tryWebShare(blob);
        if (result === 'success' || result === 'cancelled') {
            return { method: 'webShare', success: result === 'success' };
        }
        // 'failed' → 次のフォールバックへ
    }

    // 3) 新規タブで画像表示を試みる
    if (blob) {
        const opened = actions.tryNewTab(blob);
        if (opened) {
            return { method: 'newTab', success: true };
        }
    }

    // 4) 同一タブオーバーレイ表示（最終手段、常に成功）
    actions.showOverlay(dataUrl);
    return { method: 'overlay', success: true };
}
