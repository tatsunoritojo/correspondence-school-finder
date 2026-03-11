# 修正計画: LP レイアウト調整（永田さんフィードバック + 追加改善）

## 対象環境

- **対象ブランチ**: `main`（HEAD: `1223e3f`）
- **公開環境**: LP の `feature/lp-improvements` は `main` にマージ済み。本計画はマージ後に発覚した修正事項。
- **LP デプロイ先**: Vercel（`kodomo-shinro.jp`）

## Context

2026-03-07 永田さんからのフィードバック + コード調査で発見した追加修正箇所。

---

## 修正1: AboutSection の配置変更（永田さん指摘）

### 問題
「使い方」「想い」「データ収集のお願い」の3つが Futoshoku（不登校の場合の選び方）の**後**にある。
永田さんの要望: **「おすすめ（DiagnosisSection）」の前に置きたい**。

### 変更ファイル
- `landing_page/src/app/page.tsx`

### 変更内容
現在の順序:
```
Hero → Intro → Diagnosis → SchoolOptions → Futoshoku → About → FAQ → Footer
```

変更後:
```
Hero → Intro → About → Diagnosis → SchoolOptions → Futoshoku → FAQ → Footer
```

具体的には `page.tsx` の SnapSection の順序を入れ替える:

```tsx
{/* ── セクション2: Intro ── */}
<SnapSection>
    <IntroSection />
</SnapSection>

<ScrollArrow />

{/* ── セクション3: About（使い方・想い・データ収集） ── */}
<SnapSection allowScroll>
    <AboutSection />
</SnapSection>

<ScrollArrow />

{/* ── セクション4: Diagnosis ── */}
<SnapSection allowScroll>
    <DiagnosisSection />
</SnapSection>

<ScrollArrow />

{/* ── セクション5: School Options ── */}
<SnapSection>
    <SchoolOptionsSection />
</SnapSection>

<ScrollArrow />

{/* ── セクション6: 不登校セクション ── */}
<SnapSection>
    <FutoshokuSection />
</SnapSection>

<ScrollArrow />

{/* ── セクション7: FAQ ── */}
<SnapSection allowScroll>
    <FAQSection />
</SnapSection>
```

---

## 修正2: スマホモックのサイズ統一（永田さん指摘）

### 問題
質問画面（左）と結果画面（右）のモックサイズが異なって見える。
コード上は同じ `max-w-[150px] md:max-w-[180px]` だが、画像のアスペクト比や内容密度の違いにより視覚的にサイズが違って見える可能性がある。

### 変更ファイル
- `landing_page/src/components/DiagnosisSection.tsx`

### 変更内容
両方のモックに**固定の幅と高さ**を設定して完全に統一する:

現在（line 53, 69）:
```tsx
<div className="max-w-[150px] md:max-w-[180px] rounded-[2rem] border-[3px] border-stone-700 shadow-xl overflow-hidden bg-white">
```

変更後:
```tsx
<div className="w-[140px] md:w-[170px] rounded-[2rem] border-[3px] border-stone-700 shadow-xl overflow-hidden bg-white">
```

画像の高さも統一（line 61, 77）:
```tsx
{/* 変更なし — 既に同じ h-[200px] md:h-[240px] */}
className="w-full object-cover object-top h-[200px] md:h-[240px]"
```

`max-w` → `w`（固定幅）に変更することで、画像の内容に関わらずモックのサイズが完全に同じになる。

---

## 修正3: 「診断をはじめる」ボタンの文字が枠ギリギリ（永田さん指摘）

### 問題
DiagnosisSection の CTA ボタンで、モバイル表示時に「診断をはじめる」の文字がボタンの端ギリギリに表示される。

### 変更ファイル
- `landing_page/src/components/DiagnosisSection.tsx`

### 変更内容
モバイル時のパディングを追加。

現在（line 98）:
```tsx
className="... w-full py-3.5 md:w-auto md:px-10 md:py-4 lg:px-12 lg:py-5 ..."
```

変更後:
```tsx
className="... w-full px-6 py-3.5 md:w-auto md:px-10 md:py-4 lg:px-12 lg:py-5 ..."
```

モバイル時に `px-6`（24px 左右パディング）を追加。`w-full` との組み合わせで、ボタン幅はコンテナに合わせつつ文字に余裕が出る。

---

## 修正4: FAQ セクションの CTA ボタンサイズ不一致（調査で発見）

### 問題
DiagnosisSection の CTA には `lg:` ブレークポイントのスタイルがあるが、FAQSection の CTA にはない。デスクトップで2つのボタンのサイズが異なる。

| | DiagnosisSection | FAQSection |
|---|---|---|
| lg パディング | `lg:px-12 lg:py-5` | **なし** |
| lg テキスト | `lg:text-[22px]` | **なし** |
| lg アイコン | `lg:w-6 lg:h-6` | **なし** |

### 変更ファイル
- `landing_page/src/components/FAQSection.tsx`

### 変更内容
FAQSection の CTA ボタン（line 137）に `lg:` スタイルを追加:

現在:
```tsx
className="cta-pulse inline-flex items-center justify-center gap-1.5 bg-accent text-white px-8 py-3.5 md:px-10 md:py-4 rounded-lg text-[16px] md:text-[20px] font-bold tracking-wider ..."
```

変更後:
```tsx
className="cta-pulse inline-flex items-center justify-center gap-1.5 bg-accent text-white px-8 py-3.5 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg text-[16px] md:text-[20px] lg:text-[22px] font-bold tracking-wider ..."
```

SVGアイコン（line 140）にも `lg:` を追加:

現在:
```tsx
className="ml-0.5 md:w-5 md:h-5"
```

変更後:
```tsx
className="ml-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
```

---

## 修正5: セクション間パディングの不統一（調査で発見）

### 問題
各セクションの `py` 値が統一されていない:

| セクション | py 値 |
|---|---|
| DiagnosisSection | `py-4 md:py-0` |
| SchoolOptionsSection | `py-4 md:py-0` |
| FutoshokuSection | `py-4 md:py-0` |
| FAQSection | **`py-10 md:py-0`** |

FAQSection だけ `py-10`（40px）と大きく、モバイルでの余白が他と異なる。

### 変更ファイル
- `landing_page/src/components/FAQSection.tsx`

### 変更内容
FAQSection の `py-10` を他のセクションと統一:

現在（line 22）:
```tsx
<section className="py-10 md:py-0" aria-label="よくあるご質問">
```

変更後:
```tsx
<section className="py-4 md:py-0" aria-label="よくあるご質問">
```

**注意**: FAQSection は `allowScroll` でスクロール可能なため、コンテンツ量が多く上部の余白が広い方が良い可能性もある。実装後にモバイルで確認し、狭すぎる場合は `py-6` に調整する。

---

## まとめ

| # | 修正内容 | ファイル | 指摘元 |
|---|---------|---------|--------|
| 1 | AboutSection を Diagnosis の前に移動 | `page.tsx` | 永田さん |
| 2 | スマホモックを固定幅で統一 | `DiagnosisSection.tsx` | 永田さん |
| 3 | CTA ボタンにモバイル用パディング追加 | `DiagnosisSection.tsx` | 永田さん |
| 4 | FAQ CTA に `lg:` サイズ追加 | `FAQSection.tsx` | 調査で発見 |
| 5 | FAQ セクションの `py` 統一 | `FAQSection.tsx` | 調査で発見 |

### 実行順序
修正1〜5 は全て独立しており、どの順序でも実行可能。

### 検証チェックリスト
- [ ] スナップスクロール順序: Hero → Intro → **About** → Diagnosis → SchoolOptions → Futoshoku → FAQ → Footer
- [ ] スマホモック2つが同じサイズで表示される
- [ ] 「診断をはじめる」ボタンの文字に十分な余白がある（モバイル 375px で確認）
- [ ] DiagnosisSection と FAQSection の CTA ボタンがデスクトップで同じサイズ
- [ ] 各セクション間のモバイル余白が統一されている
- [ ] `cd landing_page && npm run build` がエラーなく完了
- [ ] モバイル（375px）・デスクトップ（1280px）で全体表示確認
