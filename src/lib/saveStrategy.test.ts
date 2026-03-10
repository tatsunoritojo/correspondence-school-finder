import { describe, it, expect, vi } from 'vitest';
import { executeSaveStrategy, SaveActions } from './saveStrategy';

/**
 * saveStrategy.ts のテスト
 *
 * テスト対象のロジック（全環境統一フォールバック連鎖）:
 *
 *   blob あり:
 *     → tryDirectDownload 実行
 *       → true  → download で終了
 *       → false → 次へ
 *
 *     → tryWebShare 実行
 *       → 'success'   → webShare で終了
 *       → 'cancelled' → webShare で終了（ユーザーキャンセル）
 *       → 'failed'    → 次へ
 *
 *     → tryNewTab 実行
 *       → true  → newTab で終了
 *       → false → 次へ
 *
 *   上記すべて失敗 or blob なし:
 *     → showOverlay 実行 → overlay で終了（常に成功）
 *
 * 各 action は DI で注入するため、ブラウザ API のモックは不要。
 */

function createBlob(): Blob {
    return new Blob(['test'], { type: 'image/png' });
}

const DUMMY_DATA_URL = 'data:image/png;base64,dummy';

function createMockActions(overrides?: Partial<SaveActions>): SaveActions {
    return {
        tryDirectDownload: vi.fn(() => false),
        tryWebShare: vi.fn(async () => 'failed' as const),
        tryNewTab: vi.fn(() => false),
        showOverlay: vi.fn(),
        ...overrides,
    };
}

describe('executeSaveStrategy', () => {

    // ─── 直接ダウンロード（優先度1） ───

    describe('直接ダウンロード（優先度1）', () => {
        it('download 成功 → download で終了、後続は呼ばれない', async () => {
            const actions = createMockActions({ tryDirectDownload: vi.fn(() => true) });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result).toEqual({ method: 'download', success: true });
            expect(actions.tryDirectDownload).toHaveBeenCalledOnce();
            expect(actions.tryWebShare).not.toHaveBeenCalled();
            expect(actions.tryNewTab).not.toHaveBeenCalled();
            expect(actions.showOverlay).not.toHaveBeenCalled();
        });

        it('download 失敗 → 次のフォールバックへ', async () => {
            const actions = createMockActions({
                tryDirectDownload: vi.fn(() => false),
                tryWebShare: vi.fn(async () => 'success'),
            });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result.method).toBe('webShare');
            expect(actions.tryDirectDownload).toHaveBeenCalledOnce();
            expect(actions.tryWebShare).toHaveBeenCalledOnce();
        });
    });

    // ─── Web Share API（優先度2） ───

    describe('Web Share API（優先度2）', () => {
        it('share 成功 → webShare で終了', async () => {
            const actions = createMockActions({ tryWebShare: vi.fn(async () => 'success') });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result).toEqual({ method: 'webShare', success: true });
            expect(actions.tryNewTab).not.toHaveBeenCalled();
            expect(actions.showOverlay).not.toHaveBeenCalled();
        });

        it('ユーザーキャンセル → webShare で終了（success: false）', async () => {
            const actions = createMockActions({ tryWebShare: vi.fn(async () => 'cancelled') });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result).toEqual({ method: 'webShare', success: false });
            expect(actions.tryNewTab).not.toHaveBeenCalled();
        });

        it('share 失敗 → 次のフォールバックへ', async () => {
            const actions = createMockActions({
                tryWebShare: vi.fn(async () => 'failed'),
                tryNewTab: vi.fn(() => true),
            });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result.method).toBe('newTab');
        });
    });

    // ─── 新規タブ表示（優先度3） ───

    describe('新規タブ表示（優先度3）', () => {
        it('open 成功 → newTab で終了', async () => {
            const actions = createMockActions({ tryNewTab: vi.fn(() => true) });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result).toEqual({ method: 'newTab', success: true });
            expect(actions.showOverlay).not.toHaveBeenCalled();
        });

        it('open 失敗 → overlay へ', async () => {
            const actions = createMockActions({ tryNewTab: vi.fn(() => false) });

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result.method).toBe('overlay');
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
        });
    });

    // ─── オーバーレイ表示（優先度4・最終手段） ───

    describe('オーバーレイ表示（優先度4・最終手段）', () => {
        it('全手段失敗 → overlay で終了', async () => {
            const actions = createMockActions();

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(result).toEqual({ method: 'overlay', success: true });
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
        });

        it('blob が null → 全手段スキップして overlay', async () => {
            const actions = createMockActions({
                tryDirectDownload: vi.fn(() => true),
                tryWebShare: vi.fn(async () => 'success'),
                tryNewTab: vi.fn(() => true),
            });

            const result = await executeSaveStrategy(null, DUMMY_DATA_URL, actions);

            expect(result.method).toBe('overlay');
            expect(actions.tryDirectDownload).not.toHaveBeenCalled();
            expect(actions.tryWebShare).not.toHaveBeenCalled();
            expect(actions.tryNewTab).not.toHaveBeenCalled();
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
        });
    });

    // ─── フォールバック連鎖の一気通貫テスト ───

    describe('フォールバック連鎖の一気通貫', () => {
        it('download失敗 → share失敗 → newTab失敗 → overlay に到達', async () => {
            const actions = createMockActions();

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);

            expect(actions.tryDirectDownload).toHaveBeenCalledOnce();
            expect(actions.tryWebShare).toHaveBeenCalledOnce();
            expect(actions.tryNewTab).toHaveBeenCalledOnce();
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
            expect(result).toEqual({ method: 'overlay', success: true });
        });
    });

    // ─── 環境シナリオ別テスト ───

    describe('環境シナリオ', () => {
        it('デスクトップ Chrome: download 成功 → 即終了', async () => {
            const actions = createMockActions({ tryDirectDownload: vi.fn(() => true) });
            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);
            expect(result.method).toBe('download');
        });

        it('iOS Safari: download 失敗 → share 成功', async () => {
            const actions = createMockActions({
                tryDirectDownload: vi.fn(() => false),
                tryWebShare: vi.fn(async () => 'success'),
            });
            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);
            expect(result.method).toBe('webShare');
        });

        it('LINE WebView: download/share/newTab 全滅 → overlay', async () => {
            const actions = createMockActions();
            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);
            expect(result.method).toBe('overlay');
        });

        it('Android Chrome: download 失敗 → share 失敗 → newTab 成功', async () => {
            const actions = createMockActions({
                tryDirectDownload: vi.fn(() => false),
                tryWebShare: vi.fn(async () => 'failed'),
                tryNewTab: vi.fn(() => true),
            });
            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, actions);
            expect(result.method).toBe('newTab');
        });
    });
});
