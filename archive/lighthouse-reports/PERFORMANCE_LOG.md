# パフォーマンス改善ログ

## 測定条件
- ツール: Lighthouse 12.8.2 (CLI, headless Chrome)
- 対象: http://localhost (Next.js dev server)
- カテゴリ: Performance のみ

---

## タスク1完了後: PNG→WebP変換 (2026-02-23)

| 指標 | 値 |
|------|-----|
| **Performance Score** | **27** |
| FCP (First Contentful Paint) | 4.9s |
| LCP (Largest Contentful Paint) | 18.8s |
| TBT (Total Blocking Time) | 3,140ms |
| CLS (Cumulative Layout Shift) | 0.028 |
| Speed Index | 13.0s |
| Total Byte Weight | 2,246 KiB |
| Modern Image Formats | Passed |
| Optimized Images | Passed |

### 備考
- devサーバーでの測定のため本番ビルドより遅い（JS未minify, HMR含む）
- 画像最適化 (PNG→WebP) は完了済み。画像関連の監査はすべてPassed
- まだTBT/LCPに大きな改善余地あり

---

## 全タスク完了後 (2026-02-23)

### 実施した変更
1. **画像最適化**: 全PNG→WebP変換（合計3.9MB → 569KB、85%削減）
2. **next.config**: images.formats, deviceSizes, imageSizes, compress設定追加
3. **"use client"削除**: ScrollIndicator, SnapSection をサーバーコンポーネント化
4. **framer-motion軽量化**: DiagnosisSectionのpulseアニメーションをCSS化、framer-motion依存除去
5. **フォントウェイト削減**: Noto Sans JP weight:900 削除（font-black → font-bold）

### ビルドサイズ推移
| 段階 | ページJS | First Load JS |
|------|----------|---------------|
| タスク1完了後 | 47.2 kB | 135 kB |
| タスク3完了後 | 47.0 kB | 134 kB |
| 全タスク完了後 | 46.4 kB | 134 kB |

### Lighthouse再測定
- CLIヘッドレスモードでNO_FCPエラーが発生（ページ描画検出不可）
- **ブラウザDevToolsでのLighthouse測定を推奨**
