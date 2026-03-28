# Backend Specification - PDF Generation API (Phase 1)

**Version**: 1.0
**Status**: 設計完了・実装待ち

## 1. 概要

フロントエンドのPDF生成をサーバーサイドに移行し、高品質なPDF出力を実現する。

### 現状の課題
- html2canvas + jsPDF によるクライアントサイド生成
- CSSの一部が正しく反映されない
- デバイスによって品質が異なる

### 解決策
- Playwright（Headless Chromium）によるサーバーサイドPDF生成
- 既存のHTML/CSSをそのまま活用

## 2. 技術スタック

| 項目 | 技術 |
|------|------|
| 言語 | Java 21 |
| フレームワーク | Spring Boot 3.2.x |
| PDF生成 | Playwright for Java |
| ビルドツール | Gradle |
| デプロイ | AWS (EC2 or ECS) |

## 3. API仕様

### POST /api/pdf/generate

診断結果からPDFを生成してダウンロード用URLを返す。

#### Request
```json
{
  "scores": {
    "AX01": 4.2,
    "AX02": 3.8,
    "AX03": 4.5,
    "AX04": 2.9,
    "AX05": 3.5,
    "AX06": 4.0,
    "AX07": 3.2,
    "AX08": 4.8
  },
  "knockoutAnswers": ["AX03", "AX08"],
  "respondentName": "山田太郎",
  "respondentType": "child",
  "diagnosisDate": "2024-12-23T18:00:00+09:00",
  "answers": {
    "Q1-1": 4,
    "Q1-2": 5,
    ...
  }
}
```

#### Response
```json
{
  "success": true,
  "pdfUrl": "https://xxx.s3.amazonaws.com/reports/xxx.pdf",
  "expiresAt": "2024-12-24T18:00:00+09:00"
}
```

または直接PDFバイナリを返却（Content-Type: application/pdf）

### GET /health

ヘルスチェック用エンドポイント

## 4. PDF生成フロー

```
1. APIリクエスト受信
   └── JSON バリデーション

2. HTMLテンプレート生成
   ├── Thymeleaf でデータ埋め込み
   └── PrintableReport.html 生成

3. Playwright PDF生成
   ├── Headless Chromium 起動
   ├── HTML をロード
   ├── CSS 完全適用を待機
   ├── page.pdf() で A4 PDF 出力
   └── ブラウザ終了

4. PDF 保存
   ├── S3 にアップロード
   └── 署名付きURL生成

5. レスポンス返却
```

## 5. 環境設定

### 環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `SERVER_PORT` | サーバーポート | 8080 |
| `AWS_S3_BUCKET` | S3バケット名 | school-finder-pdfs |
| `AWS_REGION` | AWSリージョン | ap-northeast-1 |
| `CORS_ALLOWED_ORIGINS` | 許可オリジン | https://xxxxx.netlify.app |

## 6. ディレクトリ構成

```
backend/
├── build.gradle
├── settings.gradle
├── src/
│   ├── main/
│   │   ├── java/com/schoolfinder/
│   │   │   ├── Application.java
│   │   │   ├── controller/
│   │   │   │   └── PdfController.java
│   │   │   ├── service/
│   │   │   │   └── PdfGenerationService.java
│   │   │   ├── dto/
│   │   │   │   ├── PdfRequest.java
│   │   │   │   └── PdfResponse.java
│   │   │   └── config/
│   │   │       ├── CorsConfig.java
│   │   │       └── PlaywrightConfig.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── templates/
│   │           └── report.html
│   └── test/
└── Dockerfile
```

## 7. フロントエンド連携

### 変更箇所

| ファイル | 変更内容 |
|---------|----------|
| `ResultPage.tsx` | html2canvas → API呼び出しに変更 |
| `services/pdfApi.ts` | 新規作成（API通信処理） |
| `.env` | `VITE_API_URL` 追加 |

### APIクライアント例

```typescript
// services/pdfApi.ts
export const generatePdf = async (data: PdfRequest): Promise<Blob> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.blob();
};
```

## 8. デプロイ構成

### AWS構成案

```
[Netlify]                    [AWS]
フロントエンド  ─────→  API Gateway
                              │
                              ▼
                        Lambda / ECS
                        (Spring Boot)
                              │
                              ▼
                           S3
                        (PDF保存)
```

### 月額コスト見積もり（軽量利用時）

| サービス | 見積もり |
|---------|---------|
| EC2 t3.micro | 〜$10/月 |
| S3 (1GB) | 〜$0.03/月 |
| データ転送 | 〜$1/月 |
| **合計** | **〜$15/月** |

## 9. 将来拡張（Phase 2以降）

- [ ] 診断結果永続化（PostgreSQL）
- [ ] 学校マッチングエンジン
- [ ] 管理者ダッシュボード
