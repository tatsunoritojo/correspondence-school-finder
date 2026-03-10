import { describe, it, expect, vi } from 'vitest';
import { executeSaveStrategy, BrowserCapabilities, SaveActions, SaveMethod } from './saveStrategy';

/**
 * saveStrategy.ts のテスト
 *
 * テスト対象のロジック（フォールバック連鎖）:
 *
 *   blob あり + canShareFiles
 *     → tryWebShare 実行
 *       → 'success'   → webShare で終了
 *       → 'cancelled' → webShare で終了（ユーザーキャンセル）
 *       → 'failed'    → 次へフォールバック
 *
 *   blob あり + canOpenNewTab
 *     → tryNewTab 実行
 *       → true  → newTab で終了
 *       → false → 次へフォールバック
 *
 *   上記すべて失敗 or blob なし
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
        tryWebShare: vi.fn(async () => 'success' as const),
        tryNewTab: vi.fn(() => true),
        showOverlay: vi.fn(),
        ...overrides,
    };
}

describe('executeSaveStrategy', () => {

    // ─── Web Share API（優先度1） ───

    describe('Web Share API（優先度1）', () => {
        it('canShareFiles + share 成功 → webShare で終了', async () => {
            const actions = createMockActions({ tryWebShare: vi.fn(async () => 'success') });
            const caps: BrowserCapabilities = { canShareFiles: true, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result).toEqual({ method: 'webShare', success: true });
            expect(actions.tryWebShare).toHaveBeenCalledOnce();
            expect(actions.tryNewTab).not.toHaveBeenCalled();
            expect(actions.showOverlay).not.toHaveBeenCalled();
        });

        it('canShareFiles + ユーザーキャンセル → webShare で終了（success: false）', async () => {
            const actions = createMockActions({ tryWebShare: vi.fn(async () => 'cancelled') });
            const caps: BrowserCapabilities = { canShareFiles: true, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result).toEqual({ method: 'webShare', success: false });
            expect(actions.tryNewTab).not.toHaveBeenCalled();
            expect(actions.showOverlay).not.toHaveBeenCalled();
        });

        it('canShareFiles + share 失敗 → 次のフォールバックへ', async () => {
            const actions = createMockActions({
                tryWebShare: vi.fn(async () => 'failed'),
                tryNewTab: vi.fn(() => true),
            });
            const caps: BrowserCapabilities = { canShareFiles: true, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result.method).toBe('newTab');
            expect(actions.tryWebShare).toHaveBeenCalledOnce();
            expect(actions.tryNewTab).toHaveBeenCalledOnce();
        });

        it('canShareFiles = false → スキップして次へ', async () => {
            const actions = createMockActions({ tryNewTab: vi.fn(() => true) });
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result.method).toBe('newTab');
            expect(actions.tryWebShare).not.toHaveBeenCalled();
        });
    });

    // ─── 新規タブ表示（優先度2） ───

    describe('新規タブ表示（優先度2）', () => {
        it('canOpenNewTab + open 成功 → newTab で終了', async () => {
            const actions = createMockActions({ tryNewTab: vi.fn(() => true) });
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result).toEqual({ method: 'newTab', success: true });
            expect(actions.showOverlay).not.toHaveBeenCalled();
        });

        it('canOpenNewTab + open 失敗 → overlay へフォールバック', async () => {
            const actions = createMockActions({ tryNewTab: vi.fn(() => false) });
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result.method).toBe('overlay');
            expect(actions.tryNewTab).toHaveBeenCalledOnce();
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
        });

        it('canOpenNewTab = false（WebView）→ スキップして overlay へ', async () => {
            const actions = createMockActions();
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: false };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result.method).toBe('overlay');
            expect(actions.tryNewTab).not.toHaveBeenCalled();
        });
    });

    // ─── オーバーレイ表示（優先度3・最終手段） ───

    describe('オーバーレイ表示（優先度3・最終手段）', () => {
        it('すべての能力が false → overlay で終了', async () => {
            const actions = createMockActions();
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: false };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(result).toEqual({ method: 'overlay', success: true });
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
        });

        it('blob が null → 全フォールバックをスキップして overlay', async () => {
            const actions = createMockActions();
            const caps: BrowserCapabilities = { canShareFiles: true, canOpenNewTab: true };

            const result = await executeSaveStrategy(null, DUMMY_DATA_URL, caps, actions);

            expect(result.method).toBe('overlay');
            expect(actions.tryWebShare).not.toHaveBeenCalled();
            expect(actions.tryNewTab).not.toHaveBeenCalled();
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
        });
    });

    // ─── フォールバック連鎖の一気通貫テスト ───

    describe('フォールバック連鎖の一気通貫', () => {
        it('share 失敗 → newTab 失敗 → overlay に到達', async () => {
            const actions = createMockActions({
                tryWebShare: vi.fn(async () => 'failed'),
                tryNewTab: vi.fn(() => false),
            });
            const caps: BrowserCapabilities = { canShareFiles: true, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);

            expect(actions.tryWebShare).toHaveBeenCalledOnce();
            expect(actions.tryNewTab).toHaveBeenCalledOnce();
            expect(actions.showOverlay).toHaveBeenCalledWith(DUMMY_DATA_URL);
            expect(result).toEqual({ method: 'overlay', success: true });
        });
    });

    // ─── 環境シナリオ別テスト ───

    describe('環境シナリオ', () => {
        it('LINE WebView: share なし + newTab なし → overlay', async () => {
            const actions = createMockActions();
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: false };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);
            expect(result.method).toBe('overlay');
        });

        it('iOS Safari: share あり + 成功 → webShare', async () => {
            const actions = createMockActions({ tryWebShare: vi.fn(async () => 'success') });
            const caps: BrowserCapabilities = { canShareFiles: true, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);
            expect(result.method).toBe('webShare');
        });

        it('Android Chrome: share なし + newTab 成功 → newTab', async () => {
            const actions = createMockActions({ tryNewTab: vi.fn(() => true) });
            const caps: BrowserCapabilities = { canShareFiles: false, canOpenNewTab: true };

            const result = await executeSaveStrategy(createBlob(), DUMMY_DATA_URL, caps, actions);
            expect(result.method).toBe('newTab');
        });
    });
});
