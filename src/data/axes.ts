import { Axis } from '../types';

export const AXES: Axis[] = [
    {
        id: 'AX01',
        name: 'スクーリング頻度の許容度',
        definition: 'Comfort with attendance pace and interpersonal stress',
        description: 'あなたは「登校頻度が少ないほうが心地よい」傾向があります。無理なく続けられるペースを大事にしたいタイプです。',
        osChecklist: [
            '登校日は月／週に何日？',
            '少人数・別室登校は可能？',
            '登校ペースは自分で調整できる？'
        ]
    },
    {
        id: 'AX02',
        name: '学費・費用の重視度',
        definition: 'Financial burden and sensitivity to additional fees',
        description: 'あなたは「学費や費用を重視する」傾向があります。経済的な負担を減らし、安心して通える学校を求めています。',
        osChecklist: [
            '就学支援金適用後の実質負担額は？',
            '制服代・教材費などの追加費用は？',
            '学費の分割払いや延納は可能？'
        ]
    },
    {
        id: 'AX03',
        name: 'オンライン学習適性',
        definition: 'Suitability for home-based digital learning',
        description: 'あなたは「オンライン学習の適性が高い」傾向があります。自宅で自分のペースで学ぶスタイルが合っています。',
        osChecklist: [
            'オンラインだけで出席が認められる日数',
            '出席管理（Zoom等）の方法',
            'オンライン完結率'
        ]
    },
    {
        id: 'AX04',
        name: '自己管理力 vs サポート必要度',
        definition: 'Autonomy level vs. need for external support',
        description: 'あなたは「手厚いサポートを求める」傾向があります。学習計画や進捗管理を一緒に伴走してくれる環境が安心です。',
        osChecklist: [
            '担任制・メンター制はあるか？',
            '学習の遅れに対するフォロー体制',
            '個別指導の有無と頻度'
        ]
    },
    {
        id: 'AX05',
        name: '進路志向',
        definition: 'Future direction and motivation for academic paths',
        description: 'あなたは「将来の進路を重視する」傾向があります。大学進学や資格取得など、卒業後の目標に向けた指導を求めています。',
        osChecklist: [
            '指定校推薦の枠と実績',
            '進学コースのカリキュラム内容',
            '面接指導や小論文対策の有無'
        ]
    },
    {
        id: 'AX06',
        name: '高校生活らしさの重視度',
        definition: 'Expectations for friendships, events, and social interaction',
        description: 'あなたは「高校生活らしい体験を大事にしたい」傾向があります。行事や部活動、友人との交流を楽しめる環境を求めています。',
        osChecklist: [
            '文化祭・体育祭などの年間行事',
            '部活動やサークルの種類と活動頻度',
            '生徒同士の交流イベントの有無'
        ]
    },
    {
        id: 'AX07',
        name: 'メンタルケア・不登校対応ニーズ',
        definition: 'Need for psychological safety and flexible support',
        description: 'あなたは「メンタル面のサポートを重視する」傾向があります。安心して相談できる場所や、心のケア体制が整った学校が合っています。',
        osChecklist: [
            'スクールカウンセラーの常駐有無',
            '保健室や相談室の利用しやすさ',
            '先生のカウンセリング資格保有率'
        ]
    },
    {
        id: 'AX08',
        name: '専門コース志向',
        definition: 'Motivation for skill-based or interest-driven learning',
        description: 'あなたは「好きな分野を深く学びたい」傾向があります。専門的なスキルや知識を身につけられるコースがある学校が合っています。',
        osChecklist: [
            '専門コース（IT・美容・芸術等）の種類',
            'プロの講師による授業があるか',
            '専門設備の充実度'
        ]
    }
];
