# コード行数 (LOC) 分析レポート

このドキュメントは、プロジェクトのスクリプトファイル（.ts, .tsx）のコード行数（Line of Code）を分析した結果をまとめたものです。

## 1. 総括

- **総コード行数**: **1,365 行**

## 2. モジュール別統計

| モジュール | コード行数 (LOC) | 割合 |
| :--- | :--- | :--- |
| `src` | 1,115 | 81.7% |
| `root` | 250 | 18.3% |
| **合計** | **1,365** | **100.0%** |

## 3. `src` モジュール内部の統計

`src` ディレクトリ内のサブモジュールごとのコード行数です。

| サブモジュール | コード行数 (LOC) | 割合 |
| :--- | :--- | :--- |
| `pages` | 415 | 37.2% |
| `components` | 297 | 26.6% |
| `data` | 207 | 18.6% |
| その他 | 110 | 9.9% |
| `lib` | 86 | 7.7% |
| **合計 (`src`)** | **1,115** | **100.0%** |

## 4. ファイル別詳細

| ファイルパス | コード行数 (LOC) |
| :--- | :--- |
| `types.ts` | 243 |
| `src/pages/DiagnosePage.tsx` | 131 |
| `src/components/QuestionCard.tsx` | 123 |
| `src/pages/ResultPage.tsx` | 122 |
| `src/data/questions.ts` | 115 |
| `src/pages/QuestionsPage.tsx` | 101 |
| `src/data/axes.ts` | 92 |
| `src/components/RadarChart.tsx` | 63 |
| `src/pages/StartPage.tsx` | 61 |
| `src/components/SaveButton.tsx` | 56 |
| `src/components/AxisCard.tsx` | 55 |
| `src/lib/storage.ts` | 46 |
| `src/types.ts` | 42 |
| `src/lib/scoring.ts` | 40 |
| `src/vite-env.d.ts` | 37 |
| `src/App.tsx` | 21 |
| `src/main.tsx` | 10 |
| `vite.config.ts` | 7 |
