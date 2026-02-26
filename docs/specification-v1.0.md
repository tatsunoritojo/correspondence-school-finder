# Correspondence School Finder - Specification v1.0

**Status**: MVP Complete Version
**Scope**: All questions, logic, UI, open school questions, and psychological framework integrated

This document provides complete implementation-ready specifications that can be directly used for development tasks.

## 0. Document Overview

本仕様書は、通信制高校を検討する 中学生と保護者向けに、
価値観・適性・優先軸を可視化する「診断コンテンツ」の MVP版 完全仕様である。

本プロダクトの目的は：

中学生／保護者の“重視ポイントの可視化”

親子間の“価値観のズレ”の可視化

オープンスクール（OS）で何を確認すべきかを提示し、行動を促す

診断結果から次のアクション（検索・調査・比較）につなげる

本仕様書は、

全20問の最終確定質問（Knockout＋8軸×2問）

スコアリング方式

親子診断の連携仕様

UI（レーダーチャート／カードUI／保存UX）

「OSで聞くべき質問」

心理学的背景

すべてを統合している。

## 1. Target Users

### Primary Users
- Middle school students considering correspondence schools
- Includes students experiencing:
  - School refusal or attendance difficulties
  - Classroom-related stress or sensory sensitivities

### Secondary Users (Decision Makers)
- Parents/guardians (prioritize: tuition, career paths, safety, continuity)

### User Characteristics
- Difficulty navigating online information (many ads)
- Unsure what questions to ask during open school visits
- Parent-child value gaps are common in this decision

## 2. Diagnostic Structure (MVP)

1. **STEP 0**: Select role (Student or Parent)
2. **STEP 1**: Knockout question (non-negotiable priority)
3. **STEP 2**: Standard questions (16 questions)
4. **STEP 3**: Score calculation (8 axes)
5. **STEP 4**: Radar chart generation (Student/Parent)
6. **STEP 5**: Card UI display (per axis)
7. **STEP 6**: Open school questions (per axis)
8. **STEP 7**: Gap visualization (parent-child comparison)
9. **STEP 8**: Search keyword recommendations
10. **STEP 9**: Result saving/sharing (URL sharing, screenshots)

## 3. Diagnostic Axes (8 Dimensions)

| Axis ID | Name | Definition |
|---------|------|------------|
| AX01 | Schooling Frequency Tolerance | Comfort with attendance pace and interpersonal stress |
| AX02 | Cost Sensitivity | Financial burden and sensitivity to additional fees |
| AX03 | Online Learning Aptitude | Suitability for home-based digital learning |
| AX04 | Self-Management vs. Support Needs | Autonomy level vs. need for external support |
| AX05 | Career Orientation | Future direction and motivation for academic paths |
| AX06 | School Life Experience Priority | Expectations for friendships, events, and social interaction |
| AX07 | Mental Health Support Needs | Need for psychological safety and flexible support |
| AX08 | Specialized Course Interest | Motivation for skill-based or interest-driven learning |
4. 質問（全17問＝Knockout1＋通常16）
4-1. Knockout質問（1問）

Q0-1
通信制高校を選ぶうえで、絶対に譲れないものをひとつ選んでください。

登校ペースの少なさ（AX01）

学費の安さ（AX02）

オンライン中心で学べること（AX03）

手厚いサポート（AX04）

大学進学を見据えた指導（AX05）

高校生活らしい交流（AX06）

メンタルケア（AX07）

好きな分野の学び（AX08）

※ 結果画面で 最重要軸コメント を表示（心理学者案の文章を採用する）

4-2. 通常質問（各軸2問 × 8軸）
AX01 スクーリング頻度の許容度

Q1-1
今のあなたにとって、登校日が少なめの学校のほうが続けやすいと感じますか。

Q1-2
週に何日も通うより、自分のペースでゆっくり登校したいという気持ちが強いですか。

AX02 学費・費用の重視度

Q2-1
通信制高校を選ぶとき、学費や総額をとても大事だと感じますか。

Q2-2
教材費や追加費用が少ない学校のほうが、安心できると感じますか。

AX03 オンライン学習適性

Q3-1
自宅で動画授業やオンライン授業を受けるほうが、集中しやすいと感じますか。

Q3-2
パソコンやタブレットで学ぶことに、抵抗がなく、むしろやりやすいと感じますか。

AX04 自己管理力 vs サポート必要度

Q4-1
宿題や課題は、言われなくても自分で計画して進めたいほうだと感じますか。

Q4-2
「いつまでに何をやるか」を、こまめに確認してもらえると安心すると感じますか。

AX05 進路志向

Q5-1
高校卒業後にどうしたいか、なんとなくでもイメージしていると感じますか。

Q5-2
将来の選択肢を広げるため、今のうちから勉強や資格取得に取り組みたいと感じますか。

AX06 高校生活らしさの重視度

Q6-1
文化祭や体育祭に少しでも参加できる機会があるとよいと感じますか。

Q6-2
同年代の友だちと会って話す時間を大切にしたいと感じますか。

AX07 メンタルケア・不登校対応ニーズ

Q7-1
これまでの学校生活で、心や体がしんどくなって通えなくなった経験・手前の感覚があったと感じますか。

Q7-2
困った時に、話を聞いてくれる先生や専門のスタッフがいると安心できると感じますか。

AX08 専門コース志向

Q8-1
IT・美容・デザインなど、特定分野をもっと深く学びたいと思いますか。

Q8-2
好きな分野が多い学校のほうが、通うモチベーションが上がると感じますか。

5. スコアリング仕様
5-1. 点数変換（5件法）

1 → 1.0

2 → 2.0

3 → 3.0

4 → 4.0

5 → 5.0

5-2. 軸スコア算出

軸スコア = 「該当2問の平均値」

5-3. Knockout重み付け

選択軸に ×1.4
※ 上限 5.0 に丸める

5-4. タイプ判定

High：4.0〜5.0

Mid：2.6〜3.9

Low：1.0〜2.5

6. 結果画面：UI仕様
6-1. レーダーチャート（8軸）

子（青）

親（緑）

ギャップは灰色帯で可視化

6-2. カードUI（軸別）
カード構造（例）
┌─────────────────────────────┐
│ 🏫 AX01：スクーリング頻度        ★★★☆☆                   │
│-----------------------------------------------------------│
│ あなたは「登校頻度が少ないほうが心地よい」傾向があります。  │
│ ・無理なく続けられるペースを大事にしたいタイプです。        │
│-----------------------------------------------------------│
│ 📝 オープンスクールで確認すること                           │
│ ・登校日は月／週に何日？                                     │
│ ・少人数・別室登校は可能？                                  │
│ ・登校ペースは自分で調整できる？                            │
└─────────────────────────────┘

6-3. OS質問リスト（軸別）

→ 仕様書 v0.2 ですでに定義済みの内容を そのまま採用

例：
AX03（オンライン適性）

オンラインだけで出席が認められる日数

出席管理（Zoom等）の方法

オンライン完結率

6-4. 強み（尖った軸）の言語化

例：
「あなたの一番の強みは “オンライン学習の適性” です。」

6-5. 検索キーワードの提示（MVP）

例：

「通信制 月1登校 広域」

「通信制 オンライン 〇〇市」

「通信制 大学進学 サポート」

6-6. 結果保存・共有導線

「長押しで画像保存できます」

html2canvasでカード画像生成

親子診断用URL共有ボタン

7. 親子診断の連携仕様
7-1. フロー

子どもが診断完了

「保護者にも診断してもらう」ボタン

/diagnose?child_id=xxxxx に遷移

親が回答

子と親の結果を重ねる

ギャップ強調表示

7-2. データ保持（MVP）

child_id は UUID

回答データは localStorage に保存

親が回答後に child_id を読み取り、2つの結果を合成

8. 軸別：心理的背景（内部仕様）
全軸ついて、行動心理学者案の

測定する心理

心理的背景
を 内部資料として参考に保存
（結果文章生成・UX改善に活用）

9. SEO設計

「通信制高校 選び方」「通信制高校 オープンスクール」などを自然に含有

診断LPをインデックス化

結果ページから関連記事へリンク

カードUIのテキストはSEOに影響しないため自由度が高い

10. MVP範囲（確定）
必須（今回のMVPで実装するもの）

17問（Knockout+16問）

レーダーチャート

カードUI

OS質問リスト

親子診断URL連携

保存導線（スクショ／画像生成）

検索キーワード提示

SEO対応LP

次フェーズ（Phase2）

学校DBとのマッチング

チェックリスト機能

ログイン・履歴保存

資料請求連携