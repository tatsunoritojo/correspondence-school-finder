# Correspondence School Finder (通信制高校 診断)

通信制高校を検討する中学生と保護者向けに、価値観・適性・優先軸を可視化する診断アプリケーションです。

## 機能 (Features)

- **診断機能**: 19問の質問（Knockout質問 + 通常質問）で、学校選びの軸を分析します。
- **レーダーチャート**: 8つの軸（スクーリング頻度、学費、オンライン適性など）を可視化します。
- **親子診断**: 生徒と保護者がそれぞれ回答し、結果を比較して「話し合うべきポイント」を提示します。
- **PDFレポート**: 診断結果をA4形式のPDFレポートとしてダウンロードできます。
- **レスポンシブ対応**: スマートフォン、タブレット、PCで快適に利用できます。

## 技術スタック (Tech Stack)

### Frontend
- **Framework**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF**: html2canvas + jsPDF（バックエンド移行予定）
- **Routing**: React Router DOM
- **Deploy**: Netlify

### Backend (開発中)
- **Framework**: Spring Boot 3.x (Java 21)
- **PDF Generation**: Playwright for Java
- **Deploy**: AWS (EC2/ECS)

## アーキテクチャ (Architecture)

```
┌──────────────────┐       ┌──────────────────┐
│    Netlify       │       │      AWS         │
│  ┌────────────┐  │       │  ┌────────────┐  │
│  │  Frontend  │──┼───────┼─▶│  Backend   │  │
│  │  (React)   │  │  API  │  │  (Spring)  │  │
│  └────────────┘  │       │  └────────────┘  │
└──────────────────┘       │        │         │
                           │        ▼         │
                           │  ┌────────────┐  │
                           │  │    S3      │  │
                           │  │  (PDF保存)  │  │
                           │  └────────────┘  │
                           └──────────────────┘
```

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
correspondence-school-finder/
├── src/                    # フロントエンドソースコード
│   ├── components/         # UIコンポーネント
│   ├── data/               # 静的データ
│   ├── lib/                # コアロジック
│   ├── pages/              # ページコンポーネント
│   └── types.ts            # TypeScript 型定義
├── docs/                   # ドキュメント
│   ├── backend-specification.md   # バックエンド仕様書
│   └── backend-setup-guide.md     # バックエンド開発手順
├── backend/                # バックエンド (Phase 1で作成予定)
│   └── ...
└── specification-v1.0.md   # フロントエンド仕様書
```

## ドキュメント (Documentation)

| ドキュメント | 説明 |
|-------------|------|
| [specification-v1.0.md](./specification-v1.0.md) | フロントエンド仕様書 |
| [docs/backend-specification.md](./docs/backend-specification.md) | バックエンド仕様書（Phase 1: PDF生成） |
| [docs/backend-setup-guide.md](./docs/backend-setup-guide.md) | バックエンド開発手順 |

## 開発ロードマップ (Roadmap)

- [x] **Phase 0**: フロントエンドMVP完成
- [ ] **Phase 1**: PDF生成バックエンド（Spring Boot + Playwright）
- [ ] **Phase 2**: データ永続化（PostgreSQL）
- [ ] **Phase 3**: 学校マッチング機能
- [ ] **Phase 4**: 管理ダッシュボード

## ライセンス (License)

Private - All rights reserved
