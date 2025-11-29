# Correspondence School Finder (通信制高校 診断)

通信制高校を検討する中学生と保護者向けに、価値観・適性・優先軸を可視化する診断アプリケーションです。

## 機能 (Features)

- **診断機能**: 17問の質問（Knockout質問 + 16問）で、学校選びの軸を分析します。
- **レーダーチャート**: 8つの軸（スクーリング頻度、学費、オンライン適性など）を可視化します。
- **親子診断**: 生徒と保護者がそれぞれ回答し、結果を比較して「話し合うべきポイント」を提示します。
- **結果保存**: 診断結果やオープンスクールで聞くべき質問リストを画像として保存できます。
- **レスポンシブ対応**: スマートフォン、タブレット、PCで快適に利用できます。

## 技術スタック (Tech Stack)

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Image Generation**: html2canvas
- **Routing**: React Router DOM

## セットアップと実行 (Getting Started)

### 前提条件 (Prerequisites)

- Node.js (v18 以降推奨)
- npm

### インストール (Installation)

```bash
npm install
```

### 開発サーバーの起動 (Development)

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開いて確認してください。

### ビルド (Build)

```bash
npm run build
```

## プロジェクト構成 (Project Structure)

```
src/
  components/    # UIコンポーネント (QuestionCard, RadarChart など)
  data/          # 静的データ (質問データ, 軸定義)
  lib/           # コアロジック (スコアリング, ストレージ)
  pages/         # ページコンポーネント (Start, Questions, Result, Diagnose)
  types.ts       # TypeScript 型定義
```

## ドキュメント (Documentation)

- `specification-v1.0.md`: 詳細仕様書
- `archive/`: 過去の指示書やセットアップガイド
