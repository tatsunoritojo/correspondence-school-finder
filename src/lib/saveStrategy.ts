/**
 * モバイル環境でのレポート保存戦略
 *
 * 環境の「能力」に基づいて最適な保存手段を決定する。
 * ブラウザ API の有無・成否で段階的にフォールバックする。
 *
 * フォールバック連鎖:
 *   1. Web Share API（ファイル共有）→ 最優先・最も確実
 *   2. window.open（新タブで画像表示）→ 次善
 *   3. 同一タブオーバーレイ表示 → 最終手段（常に成功）
 */

export type SaveMethod = 'webShare' | 'newTab' | 'overlay';

export interface SaveStrategyResult {
    method: SaveMethod;
    success: boolean;
}

export interface BrowserCapabilities {
    canShareFiles: boolean;
    canOpenNewTab: boolean;
}

export interface SaveActions {
    /** Web Share API でファイルを共有する。成功なら true */
    tryWebShare: (blob: Blob) => Promise<'success' | 'cancelled' | 'failed'>;
    /** 新規タブで Blob URL を開く。成功なら true */
    tryNewTab: (blob: Blob) => boolean;
    /** 同一タブにオーバーレイ表示する（常に成功） */
    showOverlay: (dataUrl: string) => void;
}

/**
 * 能力ベースのフォールバック連鎖を実行し、使用された手段を返す。
 *
 * @param blob       - レポート画像の Blob（null なら overlay へ直行）
 * @param dataUrl    - レポート画像の dataURL（overlay 用フォールバック）
 * @param caps       - ブラウザの能力判定結果
 * @param actions    - 各保存手段の実行関数（DI でテスト可能にする）
 */
export async function executeSaveStrategy(
    blob: Blob | null,
    dataUrl: string,
    caps: BrowserCapabilities,
    actions: SaveActions,
): Promise<SaveStrategyResult> {
    // 1) Web Share API でファイル共有を試みる
    if (blob && caps.canShareFiles) {
        const result = await actions.tryWebShare(blob);
        if (result === 'success' || result === 'cancelled') {
            return { method: 'webShare', success: result === 'success' };
        }
        // 'failed' → 次のフォールバックへ
    }

    // 2) 新規タブで画像表示を試みる
    if (blob && caps.canOpenNewTab) {
        const opened = actions.tryNewTab(blob);
        if (opened) {
            return { method: 'newTab', success: true };
        }
        // 失敗 → 次のフォールバックへ
    }

    // 3) 同一タブオーバーレイ表示（最終手段、常に成功）
    actions.showOverlay(dataUrl);
    return { method: 'overlay', success: true };
}
