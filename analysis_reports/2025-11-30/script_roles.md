# スクリプト役割分析

このドキュメントは、プロジェクト内の主要なスクリプトファイルの役割と責務をまとめたものです。

| ファイルパス | 役割 |
| :--- | :--- |
| `vite.config.ts` | Viteのビルド設定ファイル |
| `types.ts` | プロジェクトルートの型定義ファイル |
| `src/main.tsx` | ReactアプリケーションのDOMへのエントリーポイント |
| `src/App.tsx` | アプリケーション全体のルーティングを定義するメインコンポーネント |
| `src/vite-env.d.ts` | Viteの環境変数の型定義ファイル |
| `src/types.ts` | アプリケーション内部で使用する主要な型定義ファイル |
| `src/data/axes.ts` | 診断の軸（例：学習サポート、費用）の定義データ |
| `src/data/questions.ts` | 診断で使用する質問文と関連する軸のデータ |
| `src/lib/scoring.ts` | ユーザーの回答を基に各軸のスコアを算出するロジック |
| `src/lib/storage.ts` | ユーザーの回答や診断結果をブラウザのLocalStorageに保存・読込するロジック |
| `src/pages/StartPage.tsx` | 診断開始前のスタート画面を表示するページコンポーネント |
| `src/pages/QuestionsPage.tsx`| 診断の質問を表示し、ユーザーの回答を受け付けるページコンポーネント |
| `src/pages/DiagnosePage.tsx` | おまかせ診断など、特定の診断フローを提供するページコンポーнент |
| `src/pages/ResultPage.tsx` | 診断結果（レーダーチャートなど）を表示するページコンポーネント |
| `src/components/RadarChart.tsx` | 診断結果をレーダーチャート形式で描画するUIコンポーネント |
| `src/components/QuestionCard.tsx`| 質問を一つ表示するためのUIコンポーネント |
| `src/components/AxisCard.tsx` | 診断の軸（観点）を説明するためのUIコンポーネント |
| `src/components/SaveButton.tsx` | 診断結果の保存などをトリガーするボタンUIコンポーネント |
