<div align="center">

# こどもの進路案内所

### 中学校卒業後の進路選択を支援する Web サービス

[![Diagnosis Site](https://img.shields.io/badge/診断サイト-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://shindan.kodomo-shinro.jp/)
[![Landing Page](https://img.shields.io/badge/ランディングページ-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kodomo-shinro.jp/)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Supported by **[One drop](https://onedrop2025.com)**（広島県東広島市）

</div>

---

## プロジェクト概要

「こどもの進路案内所」は、通信制高校をはじめとする多様な進路の選択肢を、中学生とその保護者に分かりやすく届けるためのプロジェクトです。

> 合格できる学校ではなく、**続けられる学校**を。

| アプリ | 説明 | URL |
|--------|------|-----|
| **診断サイト** | 21問の質問で価値観・適性を可視化し、レーダーチャートとPDFレポートを生成 | [shindan.kodomo-shinro.jp](https://shindan.kodomo-shinro.jp/) |
| **ランディングページ** | 保護者向け総合案内。診断への導線、進路選択肢の紹介、FAQ、相談窓口 | [kodomo-shinro.jp](https://kodomo-shinro.jp/) |

---

## スクリーンショット

<div align="center">

| 診断サイト | ランディングページ |
|:---:|:---:|
| ![診断サイト](screenshots/diagnosis-site.png) | ![ランディングページ](screenshots/landing-page.png) |

</div>

---

## 機能一覧

### 診断サイト

| 機能 | 説明 |
|------|------|
| **診断機能** | Knockout質問 + 通常質問 + 選択式質問（計21問）で学校選びの8軸を分析 |
| **レーダーチャート** | 8軸（スクーリング頻度、学費、オンライン適性、自己管理、進路志向、学校生活、メンタルヘルス、専門課程）を可視化 |
| **AI診断コメント** | Gemini API による診断結果の要約・強み・弱みコメントを自動生成 |
| **親子診断** | 生徒・保護者それぞれの回答を比較し、「話し合うべきポイント」を提示 |
| **PDFレポート** | 診断結果をA4形式のPDFとしてダウンロード |
| **結果画像保存** | レーダーチャートを画像として保存・共有 |
| **結果共有URL** | 診断結果をURLで共有可能 |
| **データ収集** | 同意を得た上で診断データを匿名収集（Google Sheets連携） |

### ランディングページ

| 機能 | 説明 |
|------|------|
| **進路選択肢一覧** | 全日制・定時制・通信制など9種類の学校タイプをモーダルで詳細表示 |
| **不登校支援情報** | 不登校状態の場合の進路選択のポイントを解説 |
| **FAQ** | よくある質問をアコーディオンUIで表示 |
| **アニメーション** | Framer Motion によるスクロール連動フェードイン |
| **モバイルファースト** | スマートフォン・タブレット・PCに対応 |

---

## 技術スタック

### 診断サイト

```
React 18 ─── TypeScript 5 ─── Vite 5
     │
     ├─ Tailwind CSS 3 (styling)
     ├─ Recharts (radar chart)
     ├─ html2canvas + jsPDF (PDF generation)
     ├─ React Router DOM 6 (BrowserRouter)
     └─ Gemini 2.0 Flash (AI diagnosis — via Netlify Functions)
```

### ランディングページ

```
Next.js 14 (App Router) ─── TypeScript 5
     │
     ├─ Tailwind CSS 3 (styling)
     ├─ Framer Motion 11 (animation)
     └─ react-icons (icons)
```

### インフラ

| サイト | ホスティング | ドメイン |
|--------|-------------|----------|
| 診断サイト | Netlify + Netlify Functions | `shindan.kodomo-shinro.jp` |
| ランディングページ | Vercel | `kodomo-shinro.jp` |

DNS: Cloudflare / ドメイン: お名前.com

---

## セットアップ

### 前提条件

- **Node.js** v18 以降
- **npm** v9 以降

### 環境変数

```bash
cp .env.example .env
# .env を編集して API キーを設定
```

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `GEMINI_API_KEY` | Gemini AI API キー（Netlify Functions で使用） | Yes |

### 診断サイト

```bash
git clone https://github.com/tatsunoritojo/correspondence-school-finder.git
cd correspondence-school-finder
npm install
npm run dev          # → http://localhost:5173
```

### ランディングページ

```bash
cd landing_page
npm install
npm run dev          # → http://localhost:3000
```

### ビルド・テスト

```bash
npm run build        # 診断サイト → dist/
npm run test         # Vitest

cd landing_page
npm run build        # LP → .next/
```

---

## 関連リンク

| リンク | URL |
|--------|-----|
| 診断サイト | https://shindan.kodomo-shinro.jp/ |
| ランディングページ | https://kodomo-shinro.jp/ |
| One drop ホームページ | https://onedrop2025.com |
| One drop Instagram | https://www.instagram.com/onedrop.2025 |

---

## ライセンス

Private — All rights reserved

---

<div align="center">

Made with ❤️ for **こどもの未来**

</div>
