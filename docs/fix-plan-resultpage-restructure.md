# 修正計画: ResultPage 再構成 + デザイン統一

## 対象環境

- **対象ブランチ**: `main`（HEAD: `1223e3f feat: レポート保存で画像/PDF形式を選択可能に`）
- **公開環境との差分**: LP 側の修正（`fix-plan-layout-adjustments.md`）は `main` に反映済み。本計画は診断サイト側の未着手作業。
- **前提**: GA4 は未導入。本計画で GA4 導入 + カスタムイベント計測を含む。

## Context

データ収集フォームがページ最下部にあり到達率が低い問題と、AI ローディング中にスクロールしてしまう問題への対策。
加えて、ResultPage は他ページ（StartPage, QuestionsPage）より前に作成されたため、デザインの統一感が薄い。再構成と同時にデザインを統一する。

## 文言について

本計画書内のバナー文言（「診断データの活用にご協力ください」等）は**すべて仮文言**。
実装後に実際の画面を永田さんに確認してもらい、温度感を調整する。
保護者向けサービスのため「データ収集」「活用」などの表現が適切かは要レビュー。

---

## ページ構成の変更

### 現在の順序
```
① ヘッダー
② AI アドバイザー（ローディング中 → 結果表示）
③ バランスチャート
④ 通学条件・入試項目の希望
⑤ 重視ポイント詳細カード
⑥ One Drop バナー
⑦ データ収集フォーム
```

### 変更後の順序
```
① ヘッダー
② バランスチャート                      ← ③から移動（即座に描画できる）
③ AI アドバイザー                       ← ②から移動（チャートの下）
④ 【新規】データ収集お知らせバナー        ← 簡潔な案内のみ
⑤ 通学条件・入試項目の希望
⑥ 重視ポイント詳細カード
⑦ データ収集フォーム（本体）             ← 位置は変わらないが ask ステップ省略
⑧ One Drop バナー                       ← 最下部に移動
```

---

## 変更1: チャートと AI の順序入れ替え

### 変更ファイル
- `src/pages/ResultPage.tsx`

### 理由
- チャートは即座に描画できる（APIコール不要）
- AI がローディング中でもユーザーはチャートを見て結果を理解できる
- 「AI を待つためにスクロールしてしまう」問題が解消される

### 変更内容
JSX 内で、Chart Section（現在 line 298-315）を AI Advisor Section（現在 line 257-296）の前に移動する。

---

## 変更2: データ収集お知らせバナー（AI直後に挿入）

### 変更ファイル
- `src/pages/ResultPage.tsx`

### 挿入位置
AI アドバイザーセクションの直後、通学条件セクションの直前。

### UI
```
┌──────────────────────────────────────────────────┐
│  📊 診断データの活用にご協力ください                 │
│  みなさんのデータが次の世代の高校選びの               │
│  サポートになります                                │
│                                                  │
│         [  協力する  ]                             │
│        今回は見送る                                │
└──────────────────────────────────────────────────┘
```

### スタイル
- glass-card 風（ResultPage の他のカードと統一）
- コンパクト: `p-4 md:p-5 rounded-2xl mb-8`
- テキスト: `text-sm text-stone-600`
- 「協力する」: `bg-orange-500 text-white py-2 px-5 rounded-lg text-sm font-bold`
- 「今回は見送る」: `text-xs text-stone-400 underline`

### 動作
- **「協力する」を押す**: ⑦のフォーム位置（`id="data-consent-form"`）へスムーズスクロール（`scrollIntoView({ behavior: 'smooth' })`）
  - スクロール完了後、フォームの最初のインタラクティブ要素にフォーカスを移動する（`focus()` + `tabIndex={-1}`）
- **「今回は見送る」を押す**: バナー（④）とフォーム（⑦）の両方を非表示に。`localStorage` に記録

### アクセシビリティ
- 「今回は見送る」は `<a>` ではなく `<button>` として実装する（ページ遷移ではなく状態変更のため）
- お知らせバナー全体に `role="region"` + `aria-label="データ収集のご協力のお願い"` を付与
- 「協力する」ボタンに `aria-label="データ収集に協力する（フォームへ移動します）"` を付与
- スムーズスクロール後のフォーカス移動: フォームのコンテナに `tabIndex={-1}` を設定し、`scrollIntoView` 完了後に `formRef.current?.focus()` を呼ぶ
- キーボード操作: バナー内のボタンは Tab で順にフォーカス可能であること

### 表示条件
- `formStatus === "none"` のときのみ表示（過去に同意/辞退していない場合）
- ④が非表示のとき⑦も非表示（連動）

---

## 変更3: データ収集フォーム（⑦）の ask ステップ省略

### 変更ファイル
- `src/components/DataConsentForm.tsx`
- `src/pages/ResultPage.tsx`

### 理由
④のお知らせバナーで既に意図を説明しているため、⑦では ask（同意確認）ステップを省略し、form（入力フォーム）から開始する。

### 変更内容
- DataConsentForm に `skipAsk` prop を追加（`boolean`、デフォルト `false`）
- `skipAsk={true}` のとき、初期ステップを `"form"` にする
- ④のバナーからスクロールして来た場合は `skipAsk={true}`

### ⑦の表示条件
- ④の「協力する」が押された場合 → 表示（form ステップから開始）
- ④の「今回は見送る」が押された場合 → 非表示
- 過去に提出済みの場合 → 「回答を修正・追加する」リンクのみ表示（現状と同じ）

---

## 変更4: One Drop バナーを最下部に移動

### 変更ファイル
- `src/pages/ResultPage.tsx`

### 変更内容
One Drop バナー（現在 line 450-493）をデータ収集フォームの**後**に移動。

現在: ⑥ One Drop → ⑦ フォーム
変更: ⑦ フォーム → ⑧ One Drop

---

## 実装の詳細

### state の追加
```tsx
// 既存の formStatus に加えて
const [consentAccepted, setConsentAccepted] = useState(false);
// ④で「協力する」を押したかどうか。⑦の表示制御に使う
```

### ④バナーのスクロール処理
```tsx
const formRef = useRef<HTMLDivElement>(null);

const handleConsentAccept = () => {
    setConsentAccepted(true);
    // 少し遅延させてフォームがレンダリングされてからスクロール
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
};
```

### ⑦フォームに ref を追加
```tsx
<div ref={formRef} id="data-consent-form">
    {consentAccepted && (
        <DataConsentForm
            scores={finalDisplay.scores}
            role={role}
            skipAsk={true}
            isRevision={isRevision}
            onClose={(status) => { ... }}
        />
    )}
</div>
```

---

---

## 変更5: デザイン統一（ResultPage 全体）

ResultPage は他ページ（StartPage, QuestionsPage）より前に作成されたため、以下の不統一がある。再構成と同時に修正する。

### 5a. glass-card のインライン定義を削除

**問題**: ResultPage の `<style>` タグ（line 614-632）で `.glass-card` と `.glass-card-dark` を再定義しており、グローバル定義（`index.css`）と値が異なる。

| プロパティ | index.css（正） | ResultPage（誤） |
|-----------|----------------|-----------------|
| blur | `12px` | `10px` |
| border opacity | `0.8` | `0.6` |
| box-shadow | orange 系 | なし |

**修正**: `<style>` タグ内の `.glass-card` 定義を削除。グローバルの `index.css` を使う。
`.glass-card-dark` と `fadeInUp` アニメーションも `index.css` に移動し、ResultPage のインライン定義を削除する。

### 5b. 角丸の統一

**問題**: ResultPage 内で `rounded-3xl`, `rounded-2xl`, `rounded-xl`, `rounded-lg` が混在。

**修正ルール**:
- メインカード（AI, チャート, 通学条件）: `rounded-2xl`（QuestionsPage の `rounded-[2rem]` に近い）
- サブコンポーネント（グリッド内カード、タグ）: `rounded-xl`
- ボタン: `rounded-full`（QuestionsPage と統一）
- バッジ・タグ: `rounded-full`

具体的な変更:
```
glass-card p-6 rounded-3xl  →  glass-card p-6 rounded-2xl    (AI, チャート)
glass-card p-6 rounded-2xl  →  変更なし                       (通学条件)
rounded-xl                  →  rounded-full                   (Floating Action Bar のボタン)
bg-stone-700 ... rounded-lg →  bg-stone-700 ... rounded-full  (One Drop リンクボタン)
```

### 5c. 影の整理

**問題**: `shadow-sm`, `shadow-lg`, `shadow-xl`, `shadow-2xl` が混在。他ページは `shadow-xl` で統一。

**修正ルール**:
- メインカード: `shadow-lg`（AI のハイライトカードのみ `shadow-xl`）
- サブカード・ボタン: `shadow-sm`
- Floating Action Bar: `shadow-2xl`（固定UIなので強めでOK）

具体的な変更:
```
glass-card ... shadow-sm   →  glass-card ... shadow-lg      (チャート)
border-t-4 ... shadow-lg   →  shadow-xl                     (AI — ハイライトなのでOK)
```

### 5d. アニメーションの統一

**問題**: ResultPage と QuestionsPage で `fadeInUp` の値が異なる。

| | QuestionsPage | ResultPage |
|---|---|---|
| translateY | `20px` | `10px` |
| duration | `0.5s` | `0.6s` |

**修正**: `index.css` に統一定義を追加し、ResultPage のインライン `<style>` から削除:

```css
/* index.css に追加 */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

.glass-card-dark {
    background: rgba(41, 37, 36, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

QuestionsPage のインライン `<style>` からも同様に削除する。

### 5e. ボタンスタイルの統一

**問題**: QuestionsPage は `rounded-full` + `active:scale-95`、ResultPage は `rounded-xl` + `active:translate-y-[3px]`。

**修正**: ResultPage のボタンを QuestionsPage のパターンに合わせる。

Floating Action Bar 内のボタン:
```
現在: py-3 rounded-xl
変更: py-3 rounded-full active:scale-95
```

「他の項目も確認する」ボタン:
```
現在: rounded-2xl border-2 border-dashed border-stone-300
変更: rounded-2xl border-2 border-dashed border-stone-200
```
（border-stone-300 → border-stone-200 で他と統一）

### 5f. 余白の整理

**問題**: `gap-1〜6`、`mb-1〜12` が乱用されている。

**修正ルール**:
- セクション間: `mb-8`
- カード内パーツ間: `mb-4` or `gap-4`
- 細かい要素間: `mb-2` or `gap-2`
- 大きな区切り: `mt-12 pt-8`（One Drop バナー前のみ）

全ての `mb-1`, `mb-3`, `gap-1`, `gap-3` を近い値に丸める（`mb-2`, `mb-4`, `gap-2`, `gap-4`）。

### 5g. AI アドバイザーの border-t-4 の削除

**問題**: `border-t-4 border-orange-200`（ローディング時）と `border-t-4 border-orange-300`（表示時）は他ページにない装飾パターン。

**修正**: `border-t-4` を削除し、代わりにアクセントカラーの左ボーダーにする（QuestionsPage の `border-l-4 border-orange-400` パターンに近い）。
または、単純に `border-t-4` を削除して `shadow-xl` だけで差別化する。

→ `border-t-4` を削除。AI カードは `shadow-xl`（他カードは `shadow-lg`）で差別化。

---

---

## 変更6: GA4 導入 + カスタムイベント計測

### 理由
About を前に出した結果の CTA 到達率変化、お知らせバナーの協力率/見送り率、フォーム送信完了率を計測する必要がある。現仕様は build と見た目検証のみで行動指標がない。

### 6a. GA4 セットアップ

#### セットアップ手順（手動）
1. Google Analytics 4 プロパティを作成
2. 測定 ID（`G-XXXXXXXXXX`）を取得
3. 環境変数に設定:
   - 診断サイト: Netlify 環境変数 `VITE_GA4_MEASUREMENT_ID`
   - LP: Vercel 環境変数 `NEXT_PUBLIC_GA4_MEASUREMENT_ID`

#### 診断サイト（Vite + React）
`index.html` の `<head>` に gtag スクリプトを追加:
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**注意**: 測定ID は環境変数から Vite のビルド時に埋め込む。`index.html` にはプレースホルダーを置き、ビルドスクリプトまたは Netlify のスニペットインジェクションで差し替える方法を検討する。
シンプルな方法として、Netlify の「Post processing → Snippet injection」で `<head>` に挿入するのが最も簡単。コード変更不要。

#### LP（Next.js）
`landing_page/src/app/layout.tsx` に `<Script>` コンポーネントで追加。
Vercel の Analytics 機能または環境変数 + `next/script` で実装。

### 6b. カスタムイベント定義

診断サイト側で発火するイベント:

| イベント名 | 発火タイミング | パラメータ |
|-----------|-------------|-----------|
| `result_page_view` | ResultPage 表示時 | `role` |
| `chart_view` | チャートセクションが viewport に入ったとき | — |
| `ai_advice_loaded` | AI アドバイス表示完了 | — |
| `consent_banner_view` | お知らせバナー表示 | — |
| `consent_banner_accept` | 「協力する」ボタン押下 | — |
| `consent_banner_dismiss` | 「今回は見送る」押下 | — |
| `consent_form_view` | フォーム表示（スクロール到達） | `source: "banner" \| "revision"` |
| `consent_form_submit` | フォーム送信完了 | `has_email`, `has_freetext`, `satisfaction` |
| `consent_form_cancel` | フォーム「やめる」押下 | — |
| `cta_section_view` | 通学条件セクションが viewport に入ったとき | — |
| `detail_cards_view` | 詳細カードセクションが viewport に入ったとき | — |
| `one_drop_banner_view` | One Drop バナーが viewport に入ったとき | — |

LP 側で発火するイベント:

| イベント名 | 発火タイミング | パラメータ |
|-----------|-------------|-----------|
| `about_section_view` | AboutSection が viewport に入ったとき | — |
| `diagnosis_cta_click` | 「診断をはじめる」ボタン押下 | `location: "diagnosis" \| "faq"` |
| `school_option_click` | 選択肢ボタン押下 | `option_id` |

### 6c. 実装パターン

イベント発火のユーティリティ関数を作成:

```typescript
// src/lib/analytics.ts
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
}
```

viewport 進入の検知は `IntersectionObserver` を使ったカスタムフック:

```typescript
// src/hooks/useTrackView.ts
export function useTrackView(ref: RefObject<HTMLElement>, eventName: string) {
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    trackEvent(eventName);
                    observer.disconnect(); // 1回だけ発火
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, eventName]);
}
```

### 6d. 計測で検証したい仮説

| 仮説 | 計測方法 |
|------|---------|
| チャートを先に見せると AI 到達率が上がる | `chart_view` → `ai_advice_loaded` の到達率 |
| お知らせバナーがフォーム到達率を上げる | `consent_banner_accept` / `consent_banner_view` |
| About を前に出すと CTA クリック率が変わる | `about_section_view` → `diagnosis_cta_click` |
| フォーム送信完了率 | `consent_form_submit` / `consent_form_view` |

---

## 変更対象ファイルまとめ

| ファイル | 変更内容 |
|---------|---------|
| `src/pages/ResultPage.tsx` | 構成変更（1〜4）+ デザイン統一（5b〜5g）+ イベント発火（6） |
| `src/components/DataConsentForm.tsx` | `skipAsk` prop 追加（3）+ イベント発火（6） |
| `src/index.css` | `fadeInUp`, `.glass-card-dark` の定義追加（5a, 5d） |
| `src/pages/QuestionsPage.tsx` | インライン `<style>` の `fadeInUp` 削除（5d） |
| `src/lib/analytics.ts` | **新規作成**: `trackEvent` ユーティリティ（6c） |
| `src/hooks/useTrackView.ts` | **新規作成**: viewport 検知フック（6c） |
| `index.html` | GA4 スクリプト追加（6a）— Netlify スニペットインジェクションの場合は不要 |

---

## 検証チェックリスト

### 構成変更
- [ ] ページ順序: ヘッダー → チャート → AI → お知らせバナー → 通学条件 → 詳細 → フォーム → One Drop
- [ ] AI ローディング中にチャートが表示されている
- [ ] お知らせバナーの「協力する」→ フォームへスムーズスクロール
- [ ] お知らせバナーの「今回は見送る」→ バナーとフォームが両方非表示
- [ ] フォームが form ステップから開始（ask 省略）
- [ ] 過去に提出済み → お知らせバナー非表示、フォーム位置に「回答修正」リンク
- [ ] One Drop バナーがフォームの後に表示される

### アクセシビリティ
- [ ] 「今回は見送る」が `<button>` で実装されている（`<a>` ではない）
- [ ] お知らせバナーに `role="region"` + `aria-label` がある
- [ ] スクロール後にフォームにフォーカスが移動する
- [ ] キーボードのみで「協力する」→ フォーム入力 → 送信が完了できる
- [ ] Tab 順序が視覚的な順序と一致している

### デザイン統一
- [ ] glass-card がグローバル定義を使用（blur 12px, border 0.8）
- [ ] ResultPage に `<style>` タグの `.glass-card` 定義がない
- [ ] カード角丸が `rounded-2xl` で統一
- [ ] Floating Action Bar のボタンが `rounded-full`
- [ ] AI カードの `border-t-4` がなくなり `shadow-xl` で差別化
- [ ] アニメーションが `index.css` の統一定義を使用
- [ ] QuestionsPage のインライン `fadeInUp` も削除済み

### 計測
- [ ] GA4 が正常に読み込まれている（DevTools Network タブで確認）
- [ ] `result_page_view` が ResultPage 表示時に発火する
- [ ] `consent_banner_accept` / `consent_banner_dismiss` が正しく発火する
- [ ] `consent_form_submit` が送信完了時に発火する
- [ ] viewport 系イベントが1回だけ発火する（重複なし）
- [ ] GA4 リアルタイムレポートでイベントが確認できる

### 文言（実装後レビュー）
- [ ] お知らせバナーの文言を永田さんに確認
- [ ] DataConsentForm の各ステップの文言を永田さんに確認
- [ ] 「データ収集」「活用」等の表現が保護者向けとして適切か確認

### 共通
- [ ] モバイル（375px）・デスクトップ（1280px）で表示確認
- [ ] `npm run build` がエラーなく完了
