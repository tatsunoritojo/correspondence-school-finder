# ネットワーク構成 学習ガイド

> 本ドキュメントは「こどもの進路案内所」プロジェクトで実施したネットワーク設定を題材に、
> **独自ドメインの取得からHTTPS公開まで**の全体像を学べる教材です。

---

## 目次

1. [全体構成の概要](#1-全体構成の概要)
2. [ドメインとは何か](#2-ドメインとは何か)
3. [DNSの仕組み](#3-dnsの仕組み)
4. [ドメイン取得（お名前.com）](#4-ドメイン取得お名前com)
5. [DNS管理をCloudflareに移管する理由と手順](#5-dns管理をcloudflareに移管する理由と手順)
6. [Vercelでのカスタムドメイン設定（LP）](#6-vercelでのカスタムドメイン設定lp)
7. [Netlifyでのサブドメイン設定（診断サイト）](#7-netlifyでのサブドメイン設定診断サイト)
8. [DNSレコード一覧と役割](#8-dnsレコード一覧と役割)
9. [HTTPSとSSL証明書](#9-httpsとssl証明書)
10. [トラブルシューティング](#10-トラブルシューティング)
11. [用語集](#11-用語集)

---

## 1. 全体構成の概要

本プロジェクトでは、**1つのドメインで2つの独立したWebアプリケーション**を公開しています。

```
ユーザーのブラウザ
    │
    │  https://kodomo-shinro.jp/         ← LP（ランディングページ）
    │  https://shindan.kodomo-shinro.jp/ ← 診断サイト
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Cloudflare DNS（ネームサーバー）                      │
│  「このドメインへのアクセスをどこに届けるか」を管理         │
│                                                     │
│  kodomo-shinro.jp       → Vercel のサーバー           │
│  shindan.kodomo-shinro.jp → Netlify のサーバー        │
└──────────┬──────────────────────┬────────────────────┘
           │                      │
           ▼                      ▼
   ┌──────────────┐      ┌──────────────┐
   │   Vercel     │      │   Netlify    │
   │              │      │              │
   │  Next.js 14  │      │  React+Vite  │
   │  (LP)        │      │  (診断)       │
   └──────────────┘      └──────────────┘
```

### 登場するサービスと役割

| サービス | 役割 | アカウント所有者 |
|----------|------|-----------------|
| **お名前.com** | ドメインの購入・所有権管理 | クライアント |
| **Cloudflare** | DNS管理（名前解決） | クライアント |
| **Vercel** | LPのホスティング・デプロイ | 開発者 |
| **Netlify** | 診断サイトのホスティング・デプロイ | 開発者 |

---

## 2. ドメインとは何か

### ドメイン = インターネット上の住所

```
https://kodomo-shinro.jp/
  │          │         │
  │          │         └─ TLD（トップレベルドメイン）= .jp
  │          └─ セカンドレベルドメイン = kodomo-shinro
  └─ プロトコル = HTTPS（暗号化通信）
```

- **TLD（トップレベルドメイン）**: `.jp`（日本）、`.com`（商用）などの末尾部分
- **セカンドレベルドメイン**: 自分で自由に決められる部分（`kodomo-shinro`）
- **サブドメイン**: ドメインの先頭に追加する区分（`shindan.kodomo-shinro.jp` の `shindan` 部分）

### なぜ独自ドメインを使うのか

デプロイサービスのデフォルトURLと比較してみましょう。

| 種類 | URL | 印象 |
|------|-----|------|
| Netlify デフォルト | `correspondence-school-finder.netlify.app` | 長い・技術的 |
| Vercel デフォルト | `correspondence-school-finder.vercel.app` | 長い・技術的 |
| **独自ドメイン** | **`kodomo-shinro.jp`** | **短い・専門的・信頼感** |

独自ドメインを使うメリット:
- **ブランド力**: サービス名が URL に反映され、覚えやすい
- **信頼性**: `.jp` ドメインは日本向けサービスとして信頼感がある
- **SEO**: 検索エンジンがドメインの専門性を評価する
- **可搬性**: ホスティング先を変更しても URL が変わらない

---

## 3. DNSの仕組み

### DNS = ドメイン名をIPアドレスに変換する仕組み

ブラウザに `kodomo-shinro.jp` と入力すると、裏側で以下が起きています。

```
Step 1: ブラウザ
    「kodomo-shinro.jp のIPアドレスは？」
         │
         ▼
Step 2: DNSリゾルバ（ISPのサーバー）
    「.jp の管理者に聞いてみよう」
         │
         ▼
Step 3: .jp のネームサーバー
    「kodomo-shinro.jp は Cloudflare が管理しているよ」
    「ajay.ns.cloudflare.com に聞いて」
         │
         ▼
Step 4: Cloudflare ネームサーバー
    「kodomo-shinro.jp の IP は 216.198.79.1 だよ」（= Vercel）
         │
         ▼
Step 5: ブラウザ
    「216.198.79.1 に接続！」→ Vercel の LP が表示される
```

### ネームサーバー（NS）とは

ネームサーバーは「このドメインのDNS情報はどこで管理しているか」を示す設定です。

本プロジェクトでは：
- ドメインの**購入**はお名前.com で行った
- DNS の**管理**は Cloudflare に委任した

```
お名前.com（レジストラ）
  └─ NS設定: 「kodomo-shinro.jp のDNSは Cloudflare に聞いて」
       ├─ ajay.ns.cloudflare.com
       └─ cruz.ns.cloudflare.com
                │
                ▼
          Cloudflare（DNS管理）
            ├─ A レコード
            ├─ CNAME レコード
            └─ TXT レコード
```

---

## 4. ドメイン取得（お名前.com）

### 取得の流れ

```
1. お名前.com にアクセス
2. 「kodomo-shinro.jp」が空いているか検索
3. 購入手続き（年間費用を支払い）
4. ドメインの所有者として登録される
```

### お名前.com で行う設定

お名前.com では「このドメインの DNS をどこで管理するか」だけを設定します。

```
お名前.com 管理画面
  └─ ネームサーバー設定
       ├─ ネームサーバー1: ajay.ns.cloudflare.com
       └─ ネームサーバー2: cruz.ns.cloudflare.com
```

これにより、DNS の管理権限が Cloudflare に委任されます。
以降、すべての DNS レコード（A, CNAME, TXT など）は **Cloudflare** 側で設定します。

### なぜお名前.com の DNS を使わないのか

お名前.com にも DNS 機能はありますが、Cloudflare に委任する理由:

| 項目 | お名前.com | Cloudflare |
|------|-----------|------------|
| DNS管理画面 | やや複雑 | シンプルで見やすい |
| 反映速度 | 遅い（数時間〜） | 速い（数分〜） |
| CDN・キャッシュ | なし | 無料で利用可能 |
| SSL証明書 | なし | 無料で自動発行 |
| DDoS防御 | なし | 基本的な保護あり |
| 料金 | ドメイン費のみ | Free プランあり |

---

## 5. DNS管理をCloudflareに移管する理由と手順

### Cloudflare の役割

本プロジェクトでは Cloudflare を **DNS管理** として使用しています（Free プラン）。

### 移管手順

```
Step 1: Cloudflare アカウント作成
    └─ onedrop202507@gmail.com で登録

Step 2: Cloudflare にドメインを追加
    └─ 「kodomo-shinro.jp」を入力
    └─ Free プランを選択

Step 3: Cloudflare が NS を発行
    └─ ajay.ns.cloudflare.com
    └─ cruz.ns.cloudflare.com

Step 4: お名前.com で NS を変更
    └─ ネームサーバー設定画面で上記 NS を入力

Step 5: 反映待ち（数時間〜最大48時間）
    └─ Cloudflare 管理画面で「Active」になれば完了
```

### 注意: NS変更の反映時間

NS の変更は世界中の DNS サーバーに伝播する必要があるため、**最大48時間**かかることがあります。
この間、旧 NS と新 NS の両方が応答する可能性があります。

確認コマンド:
```bash
# NS が正しく設定されているか確認
nslookup -type=NS kodomo-shinro.jp

# 期待される出力:
# kodomo-shinro.jp  nameserver = ajay.ns.cloudflare.com
# kodomo-shinro.jp  nameserver = cruz.ns.cloudflare.com
```

---

## 6. Vercelでのカスタムドメイン設定（LP）

### 構成

```
kodomo-shinro.jp  ──→  Vercel（Next.js 14 LP）
www.kodomo-shinro.jp  ──→  Vercel（同上、リダイレクト）
```

### 設定手順

#### Vercel 側

```
1. Vercel ダッシュボード → プロジェクト → Settings → Domains
2. 「kodomo-shinro.jp」を追加
3. Vercel が「この DNS レコードを設定してください」と指示を表示:
     A レコード: @ → 216.198.79.1
4. 「www.kodomo-shinro.jp」も追加
5. Vercel が指示:
     CNAME レコード: www → cname.vercel-dns.com
```

#### Cloudflare 側（DNS レコード追加）

```
┌────────┬──────────┬──────────────────────┬───────┐
│ タイプ  │ 名前     │ 値                   │ Proxy │
├────────┼──────────┼──────────────────────┼───────┤
│ A      │ @        │ 216.198.79.1         │ OFF   │
│ CNAME  │ www      │ cname.vercel-dns.com │ OFF   │
└────────┴──────────┴──────────────────────┴───────┘
```

#### なぜ A レコードと CNAME を使い分けるのか

```
「@」（ルートドメイン = kodomo-shinro.jp）
  └─ A レコード（IP アドレスを直接指定）
     ※ ルートドメインには CNAME を使えない（DNS の仕様制限）

「www」（サブドメイン = www.kodomo-shinro.jp）
  └─ CNAME レコード（別のドメイン名を指定）
     ※ Vercel の IP が変わっても自動で追従する
```

> **ルートドメインに CNAME が使えない理由（RFC 1034）**:
> CNAME レコードは「そのドメインの全レコードを別名に置き換える」という意味を持ちます。
> ルートドメインには NS レコードや SOA レコードも存在するため、
> CNAME と共存できず、A レコード（IP直指定）を使う必要があります。

### www のリダイレクト

Vercel は `www.kodomo-shinro.jp` へのアクセスを自動的に `kodomo-shinro.jp` へ
308リダイレクト（永続的リダイレクト）します。これにより:

- ユーザーはどちらの URL でもアクセス可能
- SEO 的に URL が統一される（重複コンテンツの回避）

---

## 7. Netlifyでのサブドメイン設定（診断サイト）

### 構成

```
shindan.kodomo-shinro.jp  ──→  Netlify（React + Vite 診断サイト）
```

### 設定手順

#### Netlify 側

```
1. Netlify ダッシュボード → Site settings → Domain management
2. 「shindan.kodomo-shinro.jp」をカスタムドメインとして追加
3. Netlify が所有権確認を要求:
     「この TXT レコードを DNS に追加してください」
```

#### Cloudflare 側（DNS レコード追加）

```
┌────────┬──────────┬───────────────────────────────────────────┬───────┐
│ タイプ  │ 名前     │ 値                                       │ Proxy │
├────────┼──────────┼───────────────────────────────────────────┼───────┤
│ CNAME  │ shindan  │ correspondence-school-finder.netlify.app  │ OFF   │
│ TXT    │ (指定値) │ (Netlify が発行した検証トークン)             │ -     │
└────────┴──────────┴───────────────────────────────────────────┴───────┘
```

### サブドメインを使う理由

「なぜ `kodomo-shinro.jp/shindan/` ではなく `shindan.kodomo-shinro.jp` なのか？」

```
パターン A: パスで分ける（サブディレクトリ方式）
  kodomo-shinro.jp/         → LP
  kodomo-shinro.jp/shindan/ → 診断

  ❌ 問題点:
  - 同じサーバー（Vercel）に両方をデプロイする必要がある
  - Next.js と React+Vite を1つのサーバーで混在させるのは複雑
  - ビルドやデプロイの独立性が失われる

パターン B: サブドメインで分ける ✅ 今回の方式
  kodomo-shinro.jp          → LP（Vercel）
  shindan.kodomo-shinro.jp  → 診断（Netlify）

  ✅ メリット:
  - 各サイトが完全に独立（別々にデプロイ可能）
  - 異なるフレームワーク（Next.js / Vite）を自由に使える
  - 障害時の影響範囲が限定される
```

### Netlify の所有権確認（TXT レコード）

Netlify はカスタムドメインを設定する際、**ドメインの所有権を確認**します。
これは悪意のある第三者が他人のドメインを Netlify に紐づけるのを防ぐためです。

```
検証の流れ:

1. Netlify: 「DNS にこの TXT レコードを追加してください」
     └─ 例: _netlify-challenge.shindan → abc123xyz...

2. あなた: Cloudflare で TXT レコードを追加

3. Netlify: DNS を問い合わせて TXT レコードを確認
     └─ 「OK、この人はドメインの DNS を操作できる = 所有者だ」

4. カスタムドメインが有効化される
```

---

## 8. DNSレコード一覧と役割

### 本プロジェクトで使用している全レコード

```
Cloudflare DNS 管理画面
┌──────┬────────────────────────────────┬──────────────────────────────────────────────┐
│ Type │ Name                           │ Content                                      │
├──────┼────────────────────────────────┼──────────────────────────────────────────────┤
│ NS   │ kodomo-shinro.jp               │ ajay.ns.cloudflare.com                       │
│ NS   │ kodomo-shinro.jp               │ cruz.ns.cloudflare.com                       │
│ A    │ kodomo-shinro.jp               │ 216.198.79.1                                 │
│ CNAME│ www.kodomo-shinro.jp           │ cname.vercel-dns.com                         │
│ CNAME│ shindan.kodomo-shinro.jp       │ correspondence-school-finder.netlify.app     │
│ TXT  │ (Netlify指定)                  │ (所有権確認トークン)                            │
└──────┴────────────────────────────────┴──────────────────────────────────────────────┘
```

### 各レコードタイプの解説

| タイプ | 正式名 | 用途 | 例え |
|--------|--------|------|------|
| **NS** | Name Server | 「このドメインの DNS はここに聞いて」 | 電話帳の管理者の連絡先 |
| **A** | Address | ドメイン名 → IPv4 アドレス | 住所録（名前 → 住所） |
| **CNAME** | Canonical Name | ドメイン名 → 別のドメイン名 | 転送先（「この人は引っ越しました。新住所は…」） |
| **TXT** | Text | 任意のテキスト情報（認証など） | 身分証明書 |
| **AAAA** | (IPv6) Address | ドメイン名 → IPv6 アドレス | 住所録（IPv6版） |
| **MX** | Mail Exchange | メールの配送先 | 郵便局の指定 |

---

## 9. HTTPSとSSL証明書

### HTTPS が必要な理由

```
HTTP（暗号化なし）:
  ブラウザ ──── 平文 ────→ サーバー
               ↑ 盗聴可能

HTTPS（暗号化あり）:
  ブラウザ ──── 暗号化 ────→ サーバー
               ↑ 盗聴不可
```

- Chrome などのブラウザは HTTP サイトに「保護されていない通信」と警告を表示する
- SEO でも HTTPS が優遇される（Google のランキング要因）

### SSL証明書の自動発行

本プロジェクトでは SSL 証明書を**手動で取得する必要がありません**。

```
Vercel:
  カスタムドメイン設定 → Let's Encrypt で自動発行 → 自動更新

Netlify:
  カスタムドメイン設定 → Let's Encrypt で自動発行 → 自動更新
```

**Let's Encrypt** は無料の認証局（CA）で、Vercel/Netlify が内部で自動連携しています。
証明書の有効期限は90日ですが、自動で更新されるため運用負荷はゼロです。

### Cloudflare Proxy（オレンジ雲）の注意点

Cloudflare には「Proxy」機能（オレンジ色の雲アイコン）があります。

```
Proxy OFF（DNS Only / グレー雲）:
  ブラウザ → Cloudflare DNS → Vercel/Netlify  ✅ 本プロジェクトの設定

Proxy ON（オレンジ雲）:
  ブラウザ → Cloudflare CDN → Vercel/Netlify
```

本プロジェクトでは **Proxy OFF（DNS Only）** にしています。理由:
- Vercel/Netlify が独自にSSL証明書を発行するため、Cloudflare の Proxy と競合する可能性がある
- Vercel/Netlify 自体が CDN 機能を持っているため、Cloudflare CDN は不要
- 設定がシンプルになり、トラブルシューティングしやすい

---

## 10. トラブルシューティング

### DNS の確認コマンド

```bash
# A レコードの確認
nslookup kodomo-shinro.jp
# → Address: 216.198.79.1 が返れば OK

# CNAME の確認
nslookup shindan.kodomo-shinro.jp
# → correspondence-school-finder.netlify.app が返れば OK

# NS の確認
nslookup -type=NS kodomo-shinro.jp
# → ajay.ns.cloudflare.com / cruz.ns.cloudflare.com が返れば OK

# TXT レコードの確認
nslookup -type=TXT kodomo-shinro.jp
```

### よくある問題と対処

| 症状 | 原因 | 対処 |
|------|------|------|
| サイトが表示されない | DNS未反映 | 数時間待つ。`nslookup` で確認 |
| 「この接続ではプライバシーが保護されません」 | SSL証明書未発行 | Vercel/Netlify 管理画面で証明書の状態を確認。数分〜数十分待つ |
| Vercel が「Invalid Configuration」 | A レコードの IP が古い | Cloudflare で A レコードの IP を確認・修正 |
| Netlify が「Domain not verified」 | TXT レコード未設定 | Cloudflare で TXT レコードを追加 |
| `www` でアクセスできない | CNAME 未設定 | Cloudflare で www の CNAME を追加 |
| Cloudflare が「Pending」のまま | NS 未反映 | お名前.com の NS 設定を再確認。最大48時間待つ |

### DNS キャッシュのクリア

DNS の変更が反映されない場合、ローカルの DNS キャッシュが原因のことがあります。

```bash
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

---

## 11. 用語集

| 用語 | 説明 |
|------|------|
| **ドメイン** | インターネット上の住所（例: `kodomo-shinro.jp`） |
| **サブドメイン** | ドメインの前に付ける区分（例: `shindan.kodomo-shinro.jp` の `shindan`） |
| **TLD** | Top Level Domain。`.jp`, `.com` などドメインの末尾部分 |
| **レジストラ** | ドメインを販売・管理する事業者（例: お名前.com） |
| **ネームサーバー (NS)** | ドメインの DNS 情報を管理するサーバー |
| **DNS** | Domain Name System。ドメイン名を IP アドレスに変換する仕組み |
| **A レコード** | ドメイン名を IPv4 アドレスに対応付ける DNS レコード |
| **CNAME レコード** | ドメイン名を別のドメイン名に対応付ける DNS レコード |
| **TXT レコード** | 任意のテキストを格納する DNS レコード。ドメイン所有権の確認などに使用 |
| **SSL/TLS** | 通信を暗号化するプロトコル。HTTPS の基盤 |
| **Let's Encrypt** | 無料の SSL 証明書を発行する認証局 |
| **CDN** | Content Delivery Network。世界中のサーバーにコンテンツをキャッシュし高速配信 |
| **SPA** | Single Page Application。1つの HTML で動的にページを切り替えるアプリケーション |
| **プロパゲーション** | DNS 変更が世界中のサーバーに伝播すること。最大48時間かかる |

---

## 付録: 設定の時系列

```
1. お名前.com で kodomo-shinro.jp を取得
       │
2. Cloudflare アカウント作成 → ドメイン追加 → NS を取得
       │
3. お名前.com で NS を Cloudflare に変更
       │              （数時間〜48時間の反映待ち）
       │
4. Cloudflare で DNS レコードを設定
       │  ├─ A: @ → 216.198.79.1（Vercel 用）
       │  ├─ CNAME: www → cname.vercel-dns.com（Vercel 用）
       │  ├─ CNAME: shindan → ...netlify.app（Netlify 用）
       │  └─ TXT: Netlify 所有権確認用
       │
5. Vercel でカスタムドメイン追加 → 「Valid Configuration」確認
       │
6. Netlify でカスタムドメイン追加 → 所有権確認 → SSL発行
       │
7. 動作確認
       ├─ https://kodomo-shinro.jp/ → LP 表示 ✅
       ├─ https://shindan.kodomo-shinro.jp/ → 診断 表示 ✅
       └─ https://www.kodomo-shinro.jp/ → LP へリダイレクト ✅
```
