import { Axis, Question } from "../types";

export const AXES: Axis[] = [
  {
    id: "AX01",
    name: "スクーリング頻度の許容度",
    nameEn: "Schooling Frequency",
    definition: "登校ペースの少なさや対人ストレスへの配慮",
    shortDescription: "無理のない登校ペース",
    chartLabel: "登校頻度",
    psychologicalContext: "対人緊張や環境変化への感受性が高いタイプ。スモールステップでの適応を好む。",
    osChecklist: [
      "年間の必須登校日数は具体的に何日ですか？",
      "体調が悪い日に、当日の欠席連絡は必要ですか？",
      "別室登校や午後からの登校は認められますか？"
    ]
  },
  {
    id: "AX02",
    name: "学費・費用の重視度",
    nameEn: "Cost Sensitivity",
    definition: "経済的負担や追加費用への敏感さ",
    shortDescription: "学費・費用の安さ",
    chartLabel: "費用面",
    psychologicalContext: "将来への経済的不安が強く、コストパフォーマンスや透明性を重視する。",
    osChecklist: [
      "就学支援金を除いた、実質負担額はいくらですか？",
      "制服代、教科書代、修学旅行費など、追加でかかる費用はありますか？",
      "学費の分納（分割払い）は可能ですか？"
    ]
  },
  {
    id: "AX03",
    name: "オンライン学習適性",
    nameEn: "Online Aptitude",
    definition: "自宅でのデジタル学習への適性",
    shortDescription: "在宅学習のしやすさ",
    chartLabel: "在宅学習",
    psychologicalContext: "視覚優位で、自分の空間で集中することを好む。デジタルの効率性を評価する。",
    osChecklist: [
      "レポート提出はすべてタブレット/PCで完結しますか？",
      "授業動画はいつでも見返せますか？",
      "担任との連絡はチャットツール（LINEやSlackなど）で可能ですか？"
    ]
  },
  {
    id: "AX04",
    name: "自己管理 vs サポート",
    nameEn: "Support Needs",
    definition: "自律学習度と外部サポートの必要性",
    shortDescription: "手厚い学習サポート",
    chartLabel: "学習支援",
    psychologicalContext: "計画立案や遂行に不安を感じやすく、伴走者の存在に安心感を覚える。",
    osChecklist: [
      "レポートの進み具合を、先生から定期的に声掛けしてくれますか？",
      "中学校の勉強の復習（学び直し）に対応していますか？",
      "提出期限に遅れそうな場合のフォロー体制はどうなっていますか？"
    ]
  },
  {
    id: "AX05",
    name: "進路志向",
    nameEn: "Career Orientation",
    definition: "卒業後の進路意識と学習意欲",
    shortDescription: "大学・進路への強さ",
    chartLabel: "進路実績",
    psychologicalContext: "達成意欲が高く、将来のビジョンが明確。環境を「手段」として捉える傾向。",
    osChecklist: [
      "指定校推薦の枠はどのくらいありますか？",
      "進学コース特有のカリキュラムや講習はありますか？",
      "卒業生の具体的な進路実績（大学名など）を教えてください。"
    ]
  },
  {
    id: "AX06",
    name: "高校生活らしさ",
    nameEn: "School Life",
    definition: "行事や友人関係などへの期待度",
    shortDescription: "行事や友人との交流",
    chartLabel: "友人交流",
    psychologicalContext: "所属欲求や親和欲求が高い。人との関わりの中でアイデンティティを確認したい。",
    osChecklist: [
      "文化祭や体育祭などの行事は、自由参加ですか？",
      "部活動やサークル活動はありますか？",
      "クラス単位での活動はどのくらいの頻度でありますか？"
    ]
  },
  {
    id: "AX07",
    name: "メンタルケアニーズ",
    nameEn: "Mental Support",
    definition: "心理的安全性と柔軟な対応の必要性",
    shortDescription: "安心できるメンタルケア",
    chartLabel: "心のケア",
    psychologicalContext: "過去の経験から傷つきやすく、心理的安全性が確保された場所を求めている。",
    osChecklist: [
      "スクールカウンセラーは常駐していますか？",
      "先生方はカウンセリングや発達支援の研修を受けていますか？",
      "人間関係でトラブルが起きた際、どのような対応をしてくれますか？"
    ]
  },
  {
    id: "AX08",
    name: "専門コース志向",
    nameEn: "Specialized Interest",
    definition: "特定分野への興味関心と探究心",
    shortDescription: "好きな分野の専門学習",
    chartLabel: "専門学習",
    psychologicalContext: "知的好奇心が特定分野に強く向いており、没頭することでエネルギーを得る。",
    osChecklist: [
      "専門コースの授業時間は週に何時間ありますか？",
      "プロの講師から直接指導を受けられますか？",
      "その分野の資格取得やコンテスト参加のサポートはありますか？"
    ]
  },
];

export const QUESTIONS: Question[] = [
  // Knockout Question
  {
    id: "Q0-1",
    type: "knockout",
    axis: null,
    text: "通信制高校を選ぶうえで、絶対に譲れないものを1つ〜5つ選んでください。",
  },
  // AX01
  {
    id: "Q1-1",
    type: "normal",
    axis: "AX01",
    text: "今のあなたにとって、登校日が少なめの学校のほうが続けやすいと感じますか。",
  },
  {
    id: "Q1-2",
    type: "normal",
    axis: "AX01",
    text: "週に何日も通うより、自分のペースでゆっくり登校したいという気持ちが強いですか。",
  },
  // AX02
  {
    id: "Q2-1",
    type: "normal",
    axis: "AX02",
    text: "通信制高校を選ぶとき、学費や総額をとても大事だと感じますか。",
  },
  {
    id: "Q2-2",
    type: "normal",
    axis: "AX02",
    text: "教材費や追加費用が少ない学校のほうが、安心できると感じますか。",
  },
  // AX03
  {
    id: "Q3-1",
    type: "normal",
    axis: "AX03",
    text: "自宅で動画授業やオンライン授業を受けるほうが、集中しやすいと感じますか。",
  },
  {
    id: "Q3-2",
    type: "normal",
    axis: "AX03",
    text: "パソコンやタブレットで学ぶことに抵抗がなく、むしろやりやすいと感じますか。",
  },
  // AX04
  {
    id: "Q4-1",
    type: "normal",
    axis: "AX04",
    text: "勉強の進め方について、自分ひとりだとサボってしまいそうで不安がありますか。",
  },
  {
    id: "Q4-2",
    type: "normal",
    axis: "AX04",
    text: "「いつまでに何をやるか」を、先生にこまめに確認してもらえると安心すると感じますか。",
  },
  // AX05
  {
    id: "Q5-1",
    type: "normal",
    axis: "AX05",
    text: "高校卒業後にどうしたいか（大学進学など）、なんとなくでもイメージしていますか。",
  },
  {
    id: "Q5-2",
    type: "normal",
    axis: "AX05",
    text: "将来の選択肢を広げるため、今のうちから勉強や資格取得に取り組みたいと感じますか。",
  },
  // AX06
  {
    id: "Q6-1",
    type: "normal",
    axis: "AX06",
    text: "文化祭や体育祭に少しでも参加できる機会があるとよいと感じますか。",
  },
  {
    id: "Q6-2",
    type: "normal",
    axis: "AX06",
    text: "同年代の友だちと会って話す時間を大切にしたいと感じますか。",
  },
  // AX07
  {
    id: "Q7-1",
    type: "normal",
    axis: "AX07",
    text: "これまでの学校生活で、心や体がしんどくなって通えなくなった（なりかけた）経験がありますか。",
  },
  {
    id: "Q7-2",
    type: "normal",
    axis: "AX07",
    text: "困った時に、じっくり話を聞いてくれる先生やカウンセラーがいると安心できると感じますか。",
  },
  // AX08
  {
    id: "Q8-1",
    type: "normal",
    axis: "AX08",
    text: "IT・美容・デザイン・eスポーツなど、特定分野をもっと深く学びたいと思いますか。",
  },
  {
    id: "Q8-2",
    type: "normal",
    axis: "AX08",
    text: "勉強だけでなく、好きなことに没頭できる時間の多い学校が良いですか。",
  },
  // Commuting Question (New)
  {
    id: "Q9-1",
    type: "single_choice",
    axis: null,
    text: "通学時間について、希望に近いものを選んでください。",
    options: [
      { value: "30min", label: "自宅から30分以内" },
      { value: "1hour", label: "自宅から1時間以内" },
      { value: "any", label: "特にこだわらない（オンライン中心など）" },
    ],
  },
  // Exam Style Question (New)
  {
    id: "Q10-1",
    type: "multi_choice",
    axis: null,
    text: "希望する入試の方法を選んでください。（複数選択可）",
    options: [
      { value: "essay", label: "作文・小論文" },
      { value: "interview", label: "面接" },
      { value: "exam", label: "筆記試験" },
      { value: "docs", label: "書類選考のみ" },
    ],
  },
];