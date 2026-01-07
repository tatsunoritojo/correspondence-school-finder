# デプロイメントガイド - Netlify

このドキュメントでは、Netlifyへのデプロイに関する重要な設定と、**編集時に崩してはいけない箇所**について説明します。

## 🚨 重要：崩してはいけない設定

### 1. index.html の構成

**❌ やってはいけないこと：**
```html
<!-- CDNからライブラリをロードしない -->
<script src="https://cdn.tailwindcss.com"></script>
<script type="importmap">...</script>

<!-- 複数のエントリーポイントを指定しない -->
<script type="module" src="/src/main.tsx"></script>
<script type="module" src="/index.tsx"></script>  <!-- これは削除済み -->
```

**✅ 正しい設定：**
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通信制高校 診断 - Correspondence School Finder</title>
    <!-- Google Fonts のみ -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <!-- エントリーポイントは1つだけ -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**理由：**
- CDNからライブラリをロードすると、Viteのビルドシステムと競合する
- package.jsonで管理されている依存関係とバージョンが一致しなくなる
- エントリーポイントは `/src/main.tsx` のみ。これがアプリケーションの起点

### 2. netlify.toml の設定

**現在の設定（変更禁止）：**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**各設定の意味：**
- `command = "npm run build"` - ビルドコマンド（`tsc -b && vite build`を実行）
- `publish = "dist"` - デプロイするディレクトリ（Viteのビルド出力先）
- `redirects` - SPAのルーティングを正しく動作させるための設定

### 3. package.json のビルドスクリプト

**現在の設定（変更禁止）：**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

**注意点：**
- `build` スクリプトは必ず `tsc -b && vite build` の順序を保つ
- TypeScriptのコンパイルチェック後、Viteでビルドを実行

### 4. vite.config.ts の設定

**現在の設定：**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // 重要：相対パスでビルド
})
```

**注意点：**
- `base: './'` は削除しないこと（相対パスでのデプロイに必要）

### 5. TypeScript 型定義の整合性

**src/types.ts の重要な型定義：**

```typescript
// Axis型には以下のプロパティが必要
export interface Axis {
  id: AxisId;
  name: string;
  nameEn?: string;
  definition: string;
  description?: string;      // axes.ts で使用
  shortDescription?: string;
  chartLabel?: string;
  psychologicalContext?: string;
  osChecklist: string[];
}

// 互換性のための型エイリアス（削除禁止）
export type Answers = AnswerMap;
export type DiagnosticResult = DiagnosisResult;
```

**注意点：**
- `description`プロパティは`src/data/axes.ts`で使用されているため削除不可
- 型エイリアス（`Answers`, `DiagnosticResult`）は他のファイルで使用されているため削除不可

### 6. React インポートに関する注意

**React 17以降では、以下のインポートは不要：**

❌ 古い書き方（不要）：
```typescript
import React from 'react'
```

✅ 正しい書き方：
```typescript
// Reactのインポートは不要（必要なフックのみインポート）
import { useState, useEffect } from 'react'
```

**理由：**
- React 17以降、JSX変換が自動化されたため`React`のインポートは不要
- ビルド時にTypeScriptが未使用の変数としてエラーを出す

### 7. ストレージ関数の使用方法

**正しい使用方法：**
```typescript
import { LocalStorageRepository } from '../lib/storage'

// データの保存
await LocalStorageRepository.saveResult(childId, result)

// データの読み込み
const data = await LocalStorageRepository.loadData(childId)
if (data.child) {
  // 子供の診断結果を使用
}
```

**❌ 存在しない関数：**
- `loadChildResult()` - この関数は存在しません
- 代わりに `LocalStorageRepository.loadData()` を使用

### 8. calculateScores 関数の呼び出し

**正しい呼び出し方：**
```typescript
import { calculateScores } from '../lib/scoring'

// 2つの引数のみ
const scores = calculateScores(answers, knockoutAxis)
```

**❌ 間違った呼び出し方：**
```typescript
// QUESTIONS配列を渡すのは誤り
const scores = calculateScores(answers, QUESTIONS, knockoutAxis)
```

## 📁 ファイル構造（変更禁止）

```
correspondence-school-finder/
├── index.html              # エントリーHTML（CDN使用禁止）
├── netlify.toml            # Netlify設定（変更禁止）
├── package.json            # 依存関係とビルドスクリプト
├── vite.config.ts          # Vite設定（base: './' 維持）
├── tsconfig.json           # TypeScript設定
├── src/
│   ├── main.tsx            # アプリケーションのエントリーポイント
│   ├── App.tsx             # ルーティング定義
│   ├── types.ts            # 型定義（型エイリアス削除禁止）
│   ├── lib/
│   │   ├── storage.ts      # LocalStorageRepository
│   │   ├── scoring.ts      # calculateScores
│   │   └── gemini.ts       # AI機能（現在無効化）
│   ├── data/
│   │   ├── axes.ts         # Axis定義（description使用）
│   │   ├── questions.ts
│   │   └── constants.ts
│   └── pages/
│       ├── StartPage.tsx
│       ├── QuestionsPage.tsx
│       ├── ResultPage.tsx
│       └── DiagnosePage.tsx
└── dist/                   # ビルド出力（自動生成）
```

## 🔧 ローカル開発とデプロイの流れ

### ローカル開発

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### ビルドテスト（デプロイ前に必須）

```bash
# TypeScriptとビルドのチェック
npm run build

# エラーがないことを確認
# ✓ built in XX.XXs が表示されればOK
```

### デプロイ

```bash
# 変更をコミット
git add .
git commit -m "feat: 新機能の追加"

# リモートにプッシュ
git push origin main

# Netlifyが自動的にビルド・デプロイを開始
```

## 🚨 トラブルシューティング

### ビルドエラーが出た場合

1. **TypeScriptエラー**
   ```bash
   npm run build
   ```
   エラーメッセージを確認し、型定義を修正

2. **依存関係の問題**
   ```bash
   # node_modulesを削除して再インストール
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Netlifyでビルドが失敗する**
   - ローカルで `npm run build` が成功することを確認
   - netlify.toml の設定を確認
   - Netlifyのビルドログを確認

### よくある間違い

| 間違い | 正しい方法 |
|--------|------------|
| CDNからReact/Tailwindをロード | package.jsonの依存関係を使用 |
| 複数のエントリーポイント | /src/main.tsx のみ |
| `loadChildResult()` を使用 | `LocalStorageRepository.loadData()` |
| `calculateScores(a, q, k)` | `calculateScores(a, k)` |
| `import React from 'react'` | `import { useState } from 'react'` |

## 📝 新機能を追加する際の注意点

1. **新しい依存関係を追加する場合**
   ```bash
   npm install パッケージ名
   # package.jsonに自動的に追加される
   ```

2. **型定義を変更する場合**
   - `src/types.ts` を変更
   - 関連ファイル（axes.ts, questions.tsなど）の整合性を確認
   - `npm run build` でエラーがないか確認

3. **新しいページを追加する場合**
   - `src/pages/` にコンポーネントを作成
   - `src/App.tsx` にルートを追加
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```

4. **環境変数を使用する場合**
   - Viteでは `import.meta.env.VITE_変数名` を使用
   - Netlifyの管理画面で環境変数を設定

## 🔐 Gemini AI 統合について（現在無効化）

現在、Gemini AI統合は無効化されています。有効化する場合：

1. パッケージをインストール
   ```bash
   npm install @google/genai
   ```

2. `src/lib/gemini.ts` のコメントアウトを解除

3. 環境変数を設定（Netlify管理画面）
   ```
   VITE_API_KEY=your_gemini_api_key
   ```

## ✅ チェックリスト（デプロイ前）

- [ ] `npm run build` がエラーなく完了する
- [ ] index.html にCDNリンクがない
- [ ] エントリーポイントは `/src/main.tsx` のみ
- [ ] TypeScript型定義に整合性がある
- [ ] 不要な`React`インポートがない
- [ ] ローカルで動作確認済み

---

**最終更新日**: 2025-12-02
**ビルドシステム**: Vite 5.4.11 + TypeScript 5.6.2
**デプロイ先**: Netlify
