import { Question, School } from "./types";

export const SCHOOLS: School[] = [
  {
    id: "tech-future",
    name: "サイバーミライ高校",
    description: "プログラミングやデザインなど、ITスキル習得に特化した完全オンライン高校。通学不要で、自分のペースで最先端の技術を学べます。",
    tags: ["IT特化", "完全オンライン", "就職に強い"],
    features: ["メタバースキャンパス", "現役エンジニア講師", "MacBook支給制度あり"]
  },
  {
    id: "global-step",
    name: "ワールドステップ高等学院",
    description: "英語教育と国際交流に力を入れている学校。オンラインで海外の授業を受けたり、短期留学プログラムも充実しています。",
    tags: ["語学", "留学", "進学重視"],
    features: ["ネイティブ講師", "海外提携校多数", "ダブルディプロマ対応"]
  },
  {
    id: "art-freedom",
    name: "自由の森アートスクール",
    description: "イラスト、マンガ、音楽など、クリエイティブな活動を応援。制服や校則がなく、個性を最大限に尊重する環境です。",
    tags: ["芸術・表現", "校則なし", "通学自由"],
    features: ["プロ仕様のアトリエ", "作品展示会あり", "カウンセラー常駐"]
  },
  {
    id: "basic-support",
    name: "みらいサポート高校",
    description: "「中学校の復習」から丁寧に指導。週1日からの通学スタイルを選べ、先生との距離が近く、勉強に不安がある人でも安心です。",
    tags: ["基礎学習", "通学可", "メンタルサポート"],
    features: ["少人数制クラス", "個別指導あり", "生活リズム改善サポート"]
  },
  {
    id: "sports-career",
    name: "アスリート進学コース",
    description: "スポーツや芸能活動と学業を両立したい生徒に最適。遠征先や合宿所からでもレポート提出が可能。",
    tags: ["スポーツ", "芸能", "スケジュール柔軟"],
    features: ["トレーニングルーム完備", "大会公欠認定", "特別カリキュラム"]
  }
];

export const QUESTIONS: Question[] = [
  {
    id: "q1_lifestyle",
    text: "現在の生活リズムや、希望する学習スタイルについて教えてください",
    options: [
      { value: "morning", label: "朝からしっかり活動したい" },
      { value: "flexible", label: "昼夜問わず自分のペースで進めたい" },
      { value: "evening", label: "夜型なので午後から活動したい" },
      { value: "irregular", label: "不規則になりがちなので改善したい" }
    ]
  },
  {
    id: "q2_interest",
    text: "高校生活で特に力を入れたいことは何ですか？",
    options: [
      { value: "tech", label: "プログラミングやITスキル" },
      { value: "art", label: "イラスト・音楽などの創作活動" },
      { value: "study", label: "大学進学のための勉強" },
      { value: "basic", label: "まずは基礎学力の定着" },
      { value: "career", label: "将来の仕事につながる資格取得" }
    ]
  },
  {
    id: "q3_social",
    text: "クラスメイトや先生との関わり方はどうありたいですか？",
    options: [
      { value: "active", label: "友達をたくさん作りたい" },
      { value: "moderate", label: "気の合う少人数とだけ関わりたい" },
      { value: "minimal", label: "なるべく一人で集中したい" },
      { value: "online", label: "ネット上のコミュニティで交流したい" }
    ]
  },
  {
    id: "q4_future",
    text: "卒業後の進路イメージはありますか？",
    options: [
      { value: "university", label: "大学・短大へ進学" },
      { value: "specialist", label: "専門学校へ進学" },
      { value: "job", label: "就職・起業" },
      { value: "undecided", label: "まだ決まっていない" }
    ]
  }
];
