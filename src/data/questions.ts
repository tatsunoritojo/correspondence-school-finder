import { Question } from '../types';

export const QUESTIONS: Question[] = [
    // Knockout Question
    {
        id: 'Q0-1',
        text: '通信制高校を選ぶうえで、絶対に譲れないものをひとつ選んでください。',
        type: 'knockout',
        axis: null
    },
    // AX01
    {
        id: 'Q1-1',
        text: '今のあなたにとって、登校日が少なめの学校のほうが続けやすいと感じますか。',
        type: 'normal',
        axis: 'AX01'
    },
    {
        id: 'Q1-2',
        text: '週に何日も通うより、自分のペースでゆっくり登校したいという気持ちが強いですか。',
        type: 'normal',
        axis: 'AX01'
    },
    // AX02
    {
        id: 'Q2-1',
        text: '通信制高校を選ぶとき、学費や総額をとても大事だと感じますか。',
        type: 'normal',
        axis: 'AX02'
    },
    {
        id: 'Q2-2',
        text: '教材費や追加費用が少ない学校のほうが、安心できると感じますか。',
        type: 'normal',
        axis: 'AX02'
    },
    // AX03
    {
        id: 'Q3-1',
        text: '自宅で動画授業やオンライン授業を受けるほうが、集中しやすいと感じますか。',
        type: 'normal',
        axis: 'AX03'
    },
    {
        id: 'Q3-2',
        text: 'パソコンやタブレットで学ぶことに、抵抗がなく、むしろやりやすいと感じますか。',
        type: 'normal',
        axis: 'AX03'
    },
    // AX04
    {
        id: 'Q4-1',
        text: '宿題や課題は、言われなくても自分で計画して進めたいほうだと感じますか。',
        type: 'normal',
        axis: 'AX04'
    },
    {
        id: 'Q4-2',
        text: '「いつまでに何をやるか」を、こまめに確認してもらえると安心すると感じますか。',
        type: 'normal',
        axis: 'AX04'
    },
    // AX05
    {
        id: 'Q5-1',
        text: '高校卒業後にどうしたいか、なんとなくでもイメージしていると感じますか。',
        type: 'normal',
        axis: 'AX05'
    },
    {
        id: 'Q5-2',
        text: '将来の選択肢を広げるため、今のうちから勉強や資格取得に取り組みたいと感じますか。',
        type: 'normal',
        axis: 'AX05'
    },
    // AX06
    {
        id: 'Q6-1',
        text: '文化祭や体育祭に少しでも参加できる機会があるとよいと感じますか。',
        type: 'normal',
        axis: 'AX06'
    },
    {
        id: 'Q6-2',
        text: '同年代の友だちと会って話す時間を大切にしたいと感じますか。',
        type: 'normal',
        axis: 'AX06'
    },
    // AX07
    {
        id: 'Q7-1',
        text: 'これまでの学校生活で、心や体がしんどくなって通えなくなった経験・手前の感覚があったと感じますか。',
        type: 'normal',
        axis: 'AX07'
    },
    {
        id: 'Q7-2',
        text: '困った時に、話を聞いてくれる先生や専門のスタッフがいると安心できると感じますか。',
        type: 'normal',
        axis: 'AX07'
    },
    // AX08
    {
        id: 'Q8-1',
        text: 'IT・美容・デザインなど、特定分野をもっと深く学びたいと思いますか。',
        type: 'normal',
        axis: 'AX08'
    },
    {
        id: 'Q8-2',
        text: '好きな分野が多い学校のほうが、通うモチベーションが上がると感じますか。',
        type: 'normal',
        axis: 'AX08'
    },
    // Commuting Question (New)
    {
        id: 'Q9-1',
        text: '通学時間について、希望に近いものを選んでください。',
        type: 'single_choice',
        axis: null,
        options: [
            { value: '30min', label: '自宅から30分以内' },
            { value: '1hour', label: '自宅から1時間以内' },
            { value: 'any', label: '特にこだわらない（オンライン中心など）' }
        ]
    },
    // Exam Style Question (New)
    {
        id: 'Q10-1',
        text: '希望する入試の方法を選んでください。（複数選択可）',
        type: 'multi_choice',
        axis: null,
        options: [
            { value: 'essay', label: '作文・小論文' },
            { value: 'interview', label: '面接' },
            { value: 'exam', label: '筆記試験' },
            { value: 'docs', label: '書類選考のみ' }
        ]
    }
];
