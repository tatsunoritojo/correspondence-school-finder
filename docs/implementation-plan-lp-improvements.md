# 実装計画: LP改善 + データ収集機能 + ボタン誘導改善

## Context

永田さん（クライアント）からの要望とこども家庭庁面談のフィードバックを踏まえた改善。
名称変更（通信制高校診断→高校選び価値観診断）は見送り、注釈で対象を広げる方針。

---

## 計画策定時の決定事項（全12項目）

| # | 項目 | 決定内容 |
|---|------|----------|
| 1 | Sheets パッケージ | `googleapis` ではなく **`@googleapis/sheets`** を使用 |
| 2 | Rate limiting | `gemini-advice.ts` と同じ簡易インメモリ方式を流用（3 req/min/IP） |
| 3 | localStorage 読み取り | JSX内で直接ではなく **useState 初期値で1回読む** |
| 4 | スプレッドシート列 | 15列 → **19列**（childStatus, satisfaction, freeText, email 追加） |
| 5 | フォーム項目 | 5項目 → **9項目**（4グループ分け） |
| 6 | Step 1 メッセージ | お礼連絡の可能性を事前に説明する文言を追加 |
| 7 | 「お子さまの状況」選択肢 | 「不登校」→「**自宅中心の生活**」に変更 |
| 8 | プレビュー画像 | 1枚 → **2枚横並びスマホモック**（質問画面 + 結果画面、PNG） |
| 9 | AboutSection 初期状態 | **1つ目「使い方」だけ開いた状態** |
| 10 | AboutSection アニメーション | 閉じた項目のトグルアイコンが **3回パルス** |
| 11 | SchoolOptionsSection | **誘導テキスト + 「詳しく見る ▶」+ パルスアニメーション** |
| 12 | FutoshokuSection | **サブタイトル変更 + トグルアイコンパルス** |

---

## Task 1: 注釈追加（DiagnosisSection に補足文言）

### 変更ファイル
- `landing_page/src/components/DiagnosisSection.tsx`

### 変更内容
説明文 `<div>` ブロック内の2つ目の `<p>` の後（「できるだけ、わが子にあった〜」の段落の後）に補足文言を追加。

**追加するコード**:
```tsx
<p className="mt-3 md:mt-5 text-[12px] md:text-[14px] lg:text-[15px] text-text-light leading-relaxed">
    ※ 通信制高校を選びたい方だけでなく、高校選びの価値観を知りたい方にもおすすめです
</p>
```

- `text-text-light`（`#999`）で既存説明文（`text-text-sub` = `#666`）より控えめに

---

## Task 2: 診断プレビュー表示（2枚横並びスマホモック）

### 画像ファイル（PNGのまま配置）
- `landing_page/public/images/question-preview.png` — 質問画面スクショ
- `landing_page/public/images/result-preview.png` — 結果画面スクショ

元画像: `C:\Users\tatsu\Github\correspondence-school-finder\スクリーンショット 2026-03-05 201555.png`（質問画面）
結果画面は別途ユーザーから提供済み。

### 変更ファイル
- `landing_page/src/components/DiagnosisSection.tsx`

### 変更内容
「会員登録・個人情報の入力は一切不要です」テキストの**前**にプレビューブロックを挿入。

**レイアウト**: 2つのスマホモックを常に横並び（flex-row）、矢印なし

**スマホモックのCSS構造**:
- 外枠: `rounded-[2rem]`, `border-[3px] border-stone-700`, `shadow-xl`
- 上部バー（ノッチ風）: `w-16 h-1 bg-stone-300 rounded-full mx-auto mt-2`
- 画面部分: スクショ画像を `object-cover` / `object-top` で上部にフィット
- 下部グラデーション: `bg-gradient-to-t from-white to-transparent`（「続きがある」感）

**サイズ**: 各 `max-w-[150px] md:max-w-[180px]`

**キャプション**: 「こんな結果が見られます」（上部に1つ）

### スナップセクション溢れ対策
1. まず小さく表示して収まるか確認
2. 収まらない場合 → DiagnosisSection の `<SnapSection>` に `allowScroll` を追加
3. それでも不自然な場合 → プレビュー画像を Task 3 の AboutSection 内に移動

---

## Task 3: 「使い方」「想い」「データ収集のお願い」セクション追加

### 配置
Futoshoku セクション → ScrollArrow → **【ここに挿入】** → ScrollArrow → FAQ セクション

### 作成ファイル

#### 1. `landing_page/src/data/aboutData.ts`

```typescript
export type AboutSection = {
    heading?: string;
    bullets?: string[];
    text?: string;
};

export type AboutItem = {
    id: string;
    title: string;
    sections: AboutSection[];
};

export const aboutItems: AboutItem[] = [
    {
        id: "how-to-use",
        title: "このサイトの使い方",
        sections: [
            {
                heading: "どんなときに使える？",
                bullets: [
                    "保護者とお子様で進路相談をするとき",
                    "学校の先生とご家庭で懇談をするとき",
                    "フリースクールの先生とお子様が進路相談をするとき",
                    "友達と高校選びの話をするとき",
                    "高校調べをするとき",
                    "自分の高校選びの価値観を知りたいとき",
                ],
            },
            {
                heading: "どうやって使う？",
                bullets: [
                    "サイトをみて、選択肢を知る",
                    "高校選びの価値観診断をする",
                    "必要に応じて診断結果を他者に共有し、それをもとに高校選びをする",
                    "診断結果をもとに、他者に進路相談をする",
                    "選択肢にない自分のこだわりがあればフォームへ送る",
                ],
            },
            {
                heading: "診断では何がわかる？",
                bullets: [
                    "こだわり診断チャート",
                    "AIからのアドバイス",
                    "オープンスクールで聞くといいこと",
                ],
                text: "診断は何度でもできます。人の気持ちは常に変化します。その時々に合わせてご利用ください。",
            },
        ],
    },
    {
        id: "our-mission",
        title: "サイト開設の想い",
        sections: [
            {
                text: "子どもたちの進路相談を重ねる中で、こんなことを言われました。",
            },
            {
                bullets: [
                    "通信制高校が増えてきて、自分にあってる学校がどこかわからない（中学生）",
                    "私たちの時代には全日制に行くのが当たり前だったから、選択肢が増えすぎてわからない（保護者）",
                    "学校の先生とどう相談したらいいかわからない（保護者）",
                ],
            },
            {
                text: "ごもっともだと思いました。そしてそれと同時に、みなさんの進路相談や進路決定をお手伝いできるツールがあればいいのにと考えました。",
            },
            {
                text: "そして試行錯誤してできたものがこのサイトです。私たちのこれまでの経験だけでなく、中学生、保護者、高校の先生、大学の先生、心理士など多くの方にアドバイスをもらい、作成しました。",
            },
            {
                text: "また、このサイトは今後アップデートを繰り返します。みなさんの声や診断結果（任意）を集めることで、次の世代の高校選びをより質高くサポートしていきたいと思っています。みなさんとともによりよいサイトを作っていきたいと思いますので、データ収集にご協力いただける方はぜひよろしくお願いします。",
            },
            {
                text: "このサイトや価値観診断ページを利用することで、その子に合った高校選びのお手伝いをできればと思います。",
            },
        ],
    },
    {
        id: "data-collection",
        title: "データ収集の協力のお願い",
        sections: [
            {
                text: "このサイトは今後みなさんのデータをもとにアップデートをしていきます。みなさんの声が次の世代の高校選びのサポートになります。可能な方は、診断結果のデータ収集にご協力ください。",
            },
            {
                text: "データ収集が可能な場合は、住んでいる県、性別、年代、お子様の学校種・学年をお聞きします。個人が特定されることはありませんので、ご安心ください。",
            },
        ],
    },
];
```

#### 2. `landing_page/src/components/AboutSection.tsx`

FutoshokuSection のアコーディオンパターンを踏襲:
- `useState<Set<string>>` で**複数同時展開**可能
- **初期値: `new Set(["how-to-use"])`**（1つ目だけ開いた状態）
- イラスト画像なし — 全幅中央寄せのアコーディオンリストのみ
- セクションタイトルなし

**アコーディオンカードの構造** — FutoshokuSection.tsx と同一パターン:
- カード: `rounded-lg border transition-colors duration-200`, 開閉で `border-accent/30` / `border-gray-200`
- ボタン: `w-full bg-transparent border-none cursor-pointer flex items-center justify-between p-5 md:p-6`
  - タイトル: `font-semibold text-[15px] md:text-[18px] lg:text-[20px] text-text`
  - トグル: `w-[28px] h-[28px] md:w-[32px] md:h-[32px] rounded-full border-2 border-accent/40 text-accent`
- パネル: `overflow-hidden transition-all duration-300`, `maxHeight: isOpen ? "1200px" : "0px"`, `opacity: isOpen ? 1 : 0`
- コンテンツ: `bg-[#fafafa] rounded-md border-t border-gray-200 pt-4 px-4 pb-4 md:px-5 md:pb-5`
- ARIA: `id`, `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`

**閉じたアコーディオンのトグルアイコン（＋）に3回パルスアニメーション**:
- `animation: pulse-icon 2s ease-in-out 3`（3回で停止）
- `scale(1.0) → scale(1.15) → scale(1.0)`
- 開いた項目はパルスしない

**コンテンツのレンダリング**:
- `heading` → `<p className="text-[14px] md:text-[16px] lg:text-[18px] font-medium text-text mb-2">`
- `bullets` → FAQSection.tsx と同じ `<ul>` パターン
- `text` → `<p className="text-[14px] md:text-[16px] lg:text-[18px] text-text-sub leading-relaxed">`
- 各 section 間は `space-y-4`

#### 3. `landing_page/src/app/page.tsx`

import 追加 + Futoshoku→FAQ 間に挿入:
```tsx
<SnapSection allowScroll>
    <SectionWrapper>
        <AboutSection />
    </SectionWrapper>
</SnapSection>

<ScrollArrow />
```

既存の Futoshoku→FAQ 間の `<ScrollArrow />` を残し、新セクション後にもう1つ追加。

---

## Task 4: データ収集の同意機能（診断サイト側）

### アーキテクチャ
```
[診断サイト ResultPage]
    ↓ ユーザーが同意 + デモグラフィック入力
    ↓ POST /api/collect-data
[Netlify Function: collect-data.ts]
    ↓ @googleapis/sheets (サービスアカウント認証)
[Google Sheets スプレッドシート]
```

### セットアップ作業（手動 — 開発者が事前に実施）
1. Google Cloud Console でプロジェクト作成 → Google Sheets API を有効化
2. サービスアカウント作成 → JSON 鍵をダウンロード
3. Google Sheets でスプレッドシート作成（ヘッダー行は下記「列構成」参照）
4. スプレッドシートをサービスアカウントのメールに共有（編集権限）
5. Netlify 環境変数に設定:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`

### スプレッドシート列構成（19列）

| 列 | ヘッダー | 内容 | 必須/任意 |
|----|---------|------|-----------|
| A | `timestamp` | 送信日時（ISO 8601） | 自動 |
| B | `role` | child / parent | 自動 |
| C | `prefecture` | 都道府県 | 任意 |
| D | `gender` | 性別 | 任意 |
| E | `ageRange` | 年代 | 任意 |
| F | `childSchoolType` | 学校種 | 任意 |
| G | `childGrade` | 学年 | 任意 |
| H | `childStatus` | お子様の現在の状況 | 任意 |
| I | `satisfaction` | 満足度（1〜5） | 任意 |
| J | `freeText` | 自由記述 | 任意 |
| K | `email` | メールアドレス | 任意 |
| L | `AX01` | 通学環境の柔軟性 | 自動 |
| M | `AX02` | 学費・費用の重視度 | 自動 |
| N | `AX03` | オンライン学習適性 | 自動 |
| O | `AX04` | 自己管理 vs サポート | 自動 |
| P | `AX05` | 進路志向 | 自動 |
| Q | `AX06` | 高校生活らしさ | 自動 |
| R | `AX07` | メンタルケアニーズ | 自動 |
| S | `AX08` | 専門コース志向 | 自動 |

### 作成ファイル

#### 1. `src/components/DataConsentForm.tsx`

3ステップの UI コンポーネント。診断サイトのスタイル（orange, stone, glass-card）を使用。

**Props**:
```typescript
type Props = {
    scores: Record<string, number>;
    role: "child" | "parent";
    onClose: () => void;
};
```

**Step "ask"（初期表示）**:
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  📊 診断データの提供にご協力いただけますか？          │
│                                                  │
│  みなさんのデータが、次の世代の高校選びを             │
│  より良くサポートする力になります。                   │
│                                                  │
│  ・匿名の統計データとして活用します                   │
│  ・個人が特定されることはありません                   │
│  ・ご協力いただいた方にお礼のご連絡を                │
│    させていただく場合があります（任意）               │
│                                                  │
│         [  協力する  ]                             │
│                                                  │
│        今回は見送る                                │
└──────────────────────────────────────────────────┘
```
- 「協力する」: `bg-orange-500 hover:bg-orange-400 text-white py-3 px-6 rounded-xl font-bold`
- 「今回は見送る」: `text-stone-400 text-sm underline`

**Step "form"（同意後）** — 4グループに分割:
```
┌──────────────────────────────────────────────────┐
│  以下の項目にご回答ください（すべて任意です）         │
│                                                  │
│  ── あなたについて ──────────────────              │
│  お住まいの都道府県       [選択してください ▼]  任意  │
│  性別                   [選択してください ▼]  任意  │
│  年代                   [選択してください ▼]  任意  │
│                                                  │
│  ── お子さまについて ────────────────              │
│  学校種                  [選択してください ▼]  任意  │
│  学年                   [選択してください ▼]  任意  │
│  現在の状況              [選択してください ▼]  任意  │
│                                                  │
│  ── 診断について ─────────────────                │
│  この診断は役に立ちましたか？                        │
│  ☆ ☆ ☆ ☆ ☆                                     │
│  ご意見・ご感想（自由記述）                          │
│  ┌────────────────────────────────┐              │
│  │                                │              │
│  └────────────────────────────────┘              │
│                                                  │
│  ── ご連絡先 ──────────────────────              │
│  ご協力いただいた方にお礼のご連絡を                  │
│  させていただく場合があります。                      │
│  ※ 連絡不要の方は空欄のままで構いません              │
│  メールアドレス   [                        ]  任意  │
│                                                  │
│         [  送信する  ]                             │
│           やめる                                  │
└──────────────────────────────────────────────────┘
```

フォームの選択肢:
- 都道府県: 47都道府県リスト
- 性別: 男性 / 女性 / その他 / 回答しない
- 年代: 10代 / 20代 / 30代 / 40代 / 50代 / 60代以上
- 学校種: 小学校 / 中学校 / 高校 / その他
- 学年: 1年生 / 2年生 / 3年生 / 4年生 / 5年生 / 6年生
- 現在の状況: 通常登校 / 別室登校 / **自宅中心の生活** / フリースクール等に通学 / その他
- 満足度: ★5段階タップUI（未選択 `text-stone-300`、選択済み `text-orange-400`、`w-7 h-7`）
- 自由記述: `<textarea>` rows=3, placeholder「診断で分かりにくかった点、追加してほしい項目など」
- メール: `<input type="email">` placeholder `example@email.com`

スタイル:
- グループ区切り: `text-xs font-bold text-stone-400` + 左右罫線
- select: `w-full p-3 rounded-lg border border-stone-200 bg-white text-stone-700`
- 「任意」バッジ: `text-xs text-stone-400 ml-2`
- 送信中: スピナー + disabled

**Step "thanks"（送信後）**:
```
┌──────────────────────────────────────────────────┐
│  ✓ ご協力ありがとうございます！                     │
│  いただいたデータは、より良い高校選びの              │
│  サポートに活用させていただきます。                  │
│                                     [閉じる]     │
└──────────────────────────────────────────────────┘
```

**エラーハンドリング**: fetch 失敗でも "thanks" 表示。コンソールにエラーログのみ。

#### 2. `netlify/functions/collect-data.ts`

`gemini-advice.ts` のパターンを踏襲。**`@googleapis/sheets`** パッケージを使用。

**依存追加**: `npm install @googleapis/sheets`（ルートの package.json）

**流用パターン**:
- CORS ヘッダー定数
- rate limiting（**3 req/min/IP**）
- OPTIONS プリフライト対応
- POST のみ受付
- try-catch + エラーレスポンス

**リクエストボディ型**:
```typescript
interface CollectDataBody {
    scores: Record<string, number>;
    role: "child" | "parent";
    demographics: {
        prefecture: string;
        gender: string;
        ageRange: string;
        childSchoolType: string;
        childGrade: string;
        childStatus: string;
    };
    satisfaction: number | null;
    freeText: string;
    email: string;
    timestamp: string;
}
```

**バリデーション**:
- `scores` が存在しオブジェクトであること
- `role` が `"child"` or `"parent"`
- `timestamp` が存在すること
- その他は任意

#### 3. `src/pages/ResultPage.tsx`

**変更1**: import 追加:
```tsx
import DataConsentForm from "../components/DataConsentForm";
```

**変更2**: state 追加（**useState 初期値で localStorage を読む**）:
```tsx
const [consentDismissed, setConsentDismissed] = useState(
    () => localStorage.getItem('csf-data-consent') === 'done'
);
```

**変更3**: DataConsentForm を挿入。
挿入位置: line 510（One Drop バナー `</div>`）の後、line 512（`max-w-3xl` `</div>`）の前:

```tsx
{!consentDismissed && (
    <div className="mt-8">
        <DataConsentForm
            scores={finalDisplay.scores}
            role={role}
            onClose={() => {
                setConsentDismissed(true);
                localStorage.setItem('csf-data-consent', 'done');
            }}
        />
    </div>
)}
```

---

## Task 5: SchoolOptionsSection + FutoshokuSection のボタン誘導改善

### 5a. SchoolOptionsSection

**変更ファイル**: `landing_page/src/components/SchoolOptionsSection.tsx`

#### 改善1: 誘導テキスト追加
グリッドの直前に:
```tsx
<p className="text-[13px] md:text-[15px] text-accent font-medium text-center mb-3">
    気になる選択肢をタップしてみましょう
</p>
```

#### 改善2: ボタンの見た目変更
- 背景: `bg-white` → `bg-accent/5`
- ボーダー: `border-text-light/40` → `border-accent/30`
- ボタン内に縦並びで追加:
```tsx
<span className="text-[10px] md:text-[11px] text-accent mt-1">詳しく見る ▶</span>
```
- flexbox を `flex-col` に変更

#### 改善3: パルスアニメーション
- `IntersectionObserver` でセクションが画面に入ったことを検知
- **左上ボタン（1つ目）だけ**が2〜3回パルス
- `scale(1.0) → scale(1.03) → scale(1.0)` + `box-shadow` 明滅

### 5b. FutoshokuSection

**変更ファイル**: `landing_page/src/components/FutoshokuSection.tsx`

#### 改善1: サブタイトル変更
- 現状（line 73）: 「それぞれの学校の特徴を、ゆっくり見てみましょう」
- 変更: 「**それぞれの特徴をタップして確認してみましょう**」

#### 改善2: トグルアイコンパルス
- 閉じたアコーディオンの `＋` アイコンが **2〜3回パルス**して停止
- `animation: pulse-icon 2s ease-in-out 3`
- `scale(1.0) → scale(1.15) → scale(1.0)`
- 開いた項目はパルスしない

---

## 実行順序

**推奨**: Task 1 → Task 2 → Task 3 → Task 5 → Task 4

```
Task 1（注釈追加）            独立、即着手可能
Task 2（プレビュー表示）      Task 1 と同一ファイルなので Task 1 の後
Task 3（AboutSection）       独立（別ファイル）
Task 5（ボタン誘導改善）      独立（LP側、別ファイル）
Task 4（データ収集同意）      独立（診断サイト側）。Google Cloud セットアップが前提
```

---

## 最終検証チェックリスト

- [ ] LP: DiagnosisSection に注釈が表示される
- [ ] LP: 2枚のスマホモック（質問 + 結果）が横並びで表示される
- [ ] LP: スナップセクション内に収まる（または allowScroll でスクロール可能）
- [ ] LP: AboutSection のアコーディオン3つが正常に開閉する
- [ ] LP: AboutSection の1つ目が初期状態で開いている
- [ ] LP: AboutSection 閉じた項目のトグルアイコンがパルスする
- [ ] LP: SchoolOptionsSection に誘導テキスト + 「詳しく見る ▶」が表示される
- [ ] LP: SchoolOptionsSection の左上ボタンがパルスする
- [ ] LP: FutoshokuSection のサブタイトルが変更されている
- [ ] LP: FutoshokuSection のトグルアイコンがパルスする
- [ ] LP: スナップスクロール順序: Hero → Intro → Diagnosis → SchoolOptions → Futoshoku → About → FAQ → Footer
- [ ] LP: `cd landing_page && npm run build` がエラーなく完了
- [ ] 診断: ResultPage にデータ収集同意バナーが表示される
- [ ] 診断: Step 1 に箇条書き3点（匿名・個人特定なし・お礼連絡の可能性）
- [ ] 診断: 同意 → フォーム → 4グループ表示
- [ ] 診断: 満足度★タップ動作
- [ ] 診断: 自由記述入力可能
- [ ] 診断: メールアドレス欄あり
- [ ] 診断: 「お子さまの状況」に「自宅中心の生活」がある（「不登校」はない）
- [ ] 診断: 全項目未入力で送信 → 成功
- [ ] 診断: 送信 → Google Sheets に19列のデータ追加
- [ ] 診断: 辞退 → バナー非表示 → リロードしても非表示
- [ ] 診断: ネットワークエラー時 → thanks 表示（コンソールのみエラー）
- [ ] 診断: `npm run build` がエラーなく完了
- [ ] 両サイト: モバイル（375px）・デスクトップ（1280px）で表示確認
