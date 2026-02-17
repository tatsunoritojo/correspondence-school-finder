import { useState, useEffect, useRef } from "react";

/* ──────────────── data ──────────────── */
const schoolOptions = [
  { id: "public-fulltime", label: "全日制\n（公立）", description: "平日の昼間に通学する学年制の高校です。高校と言われてイメージされやすい高校です。入学は都道府県の入学者選抜（学力検査・調査書など）で行われます。基礎から段階的に学びたい人に向いています。卒業すると高卒資格を取得できます。学費が比較的低く、進学・就職の選択肢が幅広い点が特徴です。時間割が固定されているため、毎日の通学が前提になります。" },
  { id: "private-fulltime", label: "全日制\n（私立）", description: "平日の昼間に通学する全日制の高校です。学校ごとに教育方針やコース設定に特色があります。推薦入試や専願入試など、入試方法は多様です。目的や関心に合った教育を受けたい人に向いています。卒業すると高卒資格を取得できます。少人数指導や独自プログラムが魅力です。公立に比べて学費が高くなる場合があります。" },
  { id: "part-time", label: "定時制", description: "主に夕方から夜に授業を行う高校です。学年制と単位制があります。入学は学力検査を行う場合と行わない場合があります。昼間の通学が難しい人や、生活リズムに配慮したい人に向いています。卒業すると高卒資格を取得できます。落ち着いた環境で学べる点が特徴です。卒業までに4年以上かかることがあります。" },
  { id: "correspondence", label: "通信制", description: "レポート提出とスクーリングを組み合わせて学ぶ高校です。登校日数は学校ごとに異なります。入学は書類選考が中心です。自分のペースで学習したい人に向いています。卒業要件を満たすと高卒資格を取得できます。時間や場所の自由度が高い点が特徴です。学習管理は本人の意識が重要になります。" },
  { id: "vocational", label: "専修学校\n高等課程", description: "専門学校に設置された高等課程です。職業や実技を重視した学びが中心です。入学は学校独自の選考で行われます。早い段階から専門分野に触れたい人に向いています。修了時は原則として高卒扱いです。条件を満たすことで高卒資格を取得できる場合もあります。進学先の条件確認が重要です。" },
  { id: "kosen", label: "高等専門学校", description: "中学校卒業後に入学し、5年間一貫で専門分野を学ぶ学校です。理工系分野が中心です。入学は学力検査による選抜です。専門性を重視した学習を希望する人に向いています。5年修了時点では高卒資格は取得しません。進学や就職では高卒扱い以上として扱われます。進路の方向性は事前検討が必要です。" },
  { id: "regional", label: "地域みらい\n留学", description: "地方の公立高校へ進学し、地域の中で学ぶ制度です。入学は自治体や学校ごとの選考で行われます。環境を変えて学びたい人に向いています。少人数教育や地域連携が特徴です。卒業すると高卒資格を取得できます。生活環境が大きく変わるため、事前の情報収集が重要です。" },
  { id: "special-support", label: "特別支援", description: "障害や特性に応じた支援を受けながら学ぶ学校です。入学は教育委員会や学校の判断によります。個別の支援を重視した学びを希望する人に向いています。修了後は高卒扱いとなります。生活や就労に向けた実践的な学習が中心です。進路の方向性は早めの相談が大切です。" },
  { id: "equivalency", label: "高卒認定\n試験", description: "高校に在籍せず、試験に合格することで高校卒業と同程度の学力を証明する制度です。受験資格を満たせば受験できます。自分のペースで学びたい人に向いています。取得後は高卒扱いとなります。大学や専門学校への進学が可能です。学校生活そのものは含まれません。" },
];

const faqItems = [
  { id: "q1", question: "Q1：（質問内容 原稿未定）", answer: "（回答内容 原稿未定）ここにQ1の回答が入ります。原稿が確定次第、差し替えてください。" },
  { id: "q2", question: "Q2：（質問内容 原稿未定）", answer: "（回答内容 原稿未定）ここにQ2の回答が入ります。原稿が確定次第、差し替えてください。" },
  { id: "q3", question: "Q3：（質問内容 原稿未定）", answer: "（回答内容 原稿未定）ここにQ3の回答が入ります。原稿が確定次第、差し替えてください。" },
  { id: "q4", question: "Q4：（質問内容 原稿未定）", answer: "（回答内容 原稿未定）ここにQ4の回答が入ります。原稿が確定次第、差し替えてください。" },
];

/* ──────────────── hooks ──────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ──────────────── small components ──────────────── */
const ScrollArrow = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "28px 0" }}>
    <svg width="18" height="28" viewBox="0 0 18 28" fill="none" style={{ animation: "bounceArrow 2s ease-in-out infinite" }}>
      <path d="M9 0 L9 24 M2 18 L9 26 L16 18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

function FadeSection({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* ──── Modal ──── */
function SchoolModal({ option, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 280);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: show ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
        transition: "background 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAF7F2",
          borderRadius: "16px",
          padding: "32px 24px 28px",
          maxWidth: "440px",
          width: "100%",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          opacity: show ? 1 : 0,
          transform: show ? "scale(1) translateY(0)" : "scale(0.92) translateY(16px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {/* close button */}
        <button
          onClick={handleClose}
          aria-label="閉じる"
          style={{
            position: "absolute", top: "12px", right: "14px",
            background: "none", border: "none", cursor: "pointer",
            width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="#666" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ width: "40px", height: "3px", background: "#333", borderRadius: "2px", margin: "0 auto 20px" }} />

        <h3 style={{
          fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700,
          fontSize: "18px", textAlign: "center", marginBottom: "20px",
          letterSpacing: "1px", color: "#333",
        }}>
          {option.label.replace(/\n/g, "")}
        </h3>

        <div style={{ height: "1px", background: "#ddd", margin: "0 0 20px" }} />

        <p style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: "13.5px", lineHeight: 2.1, color: "#555",
          textAlign: "justify",
        }}>
          {option.description}
        </p>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={handleClose}
            style={{
              background: "none", border: "1.5px solid #ccc",
              borderRadius: "24px", padding: "8px 32px",
              fontSize: "12px", color: "#888", cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.color = "#555"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.color = "#888"; }}
          >
            とじる
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──── FAQ Section ──── */
function FAQSection() {
  const [openIds, setOpenIds] = useState(new Set());

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section style={{ padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {/* イラスト（プレースホルダー：看板を持つ人物） */}
        <div style={{ flexShrink: 0 }}>
          <SignboardPerson text={"よくある\n質問"} />
        </div>

        {/* Q&A リスト */}
        <div style={{ flex: 1, paddingTop: "8px" }}>
          {faqItems.map((item, i) => {
            const isOpen = openIds.has(item.id);
            return (
              <div key={item.id} style={{ borderBottom: i < faqItems.length - 1 ? "1px solid var(--border)" : "none" }}>
                <button
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 4px", fontFamily: "var(--font-body)",
                    fontSize: "13px", fontWeight: 600, color: "var(--text)",
                    textAlign: "left", gap: "8px",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span>{item.question}</span>
                  <span style={{
                    flexShrink: 0, width: "22px", height: "22px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", border: "1.5px solid #ccc",
                    fontSize: "16px", lineHeight: 1, color: "#999",
                    transition: "transform 0.25s ease",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}>
                    +
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? "300px" : "0px",
                  opacity: isOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s ease, opacity 0.3s ease",
                }}>
                  <p style={{
                    padding: "0 4px 14px",
                    fontSize: "12.5px", lineHeight: 1.9,
                    color: "var(--text-sub)",
                  }}>
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──── SVG Illustrations ──── */
const HeroIllustration = () => (
  <svg width="130" height="120" viewBox="0 0 130 120" fill="none">
    <rect x="20" y="70" width="90" height="4" rx="2" fill="#ccc"/>
    <rect x="30" y="74" width="4" height="30" rx="1" fill="#ccc"/>
    <rect x="86" y="74" width="4" height="30" rx="1" fill="#ccc"/>
    <rect x="38" y="48" width="44" height="22" rx="3" stroke="#333" strokeWidth="2" fill="#f8f8f8"/>
    <rect x="42" y="52" width="36" height="14" rx="1" fill="#dbeafe"/>
    <rect x="32" y="70" width="56" height="3" rx="1.5" fill="#ddd"/>
    <circle cx="95" cy="32" r="14" stroke="#333" strokeWidth="2" fill="#fff"/>
    <path d="M82 28 Q82 16 95 16 Q108 16 108 28" stroke="#333" strokeWidth="2" fill="#333"/>
    <circle cx="90" cy="33" r="1.5" fill="#333"/>
    <circle cx="100" cy="33" r="1.5" fill="#333"/>
    <path d="M92 38 Q95 41 98 38" stroke="#333" strokeWidth="1.2" fill="none"/>
    <path d="M95 46 L95 65" stroke="#333" strokeWidth="2"/>
    <path d="M95 52 L78 62" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    <path d="M95 52 L112 58" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    <path d="M95 65 L85 90" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    <path d="M95 65 L105 90" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
    <rect x="0" y="4" width="68" height="22" rx="11" stroke="#333" strokeWidth="1.2" fill="#fff"/>
    <text x="34" y="19" textAnchor="middle" style={{ fontSize: "9px", fontFamily: "'Zen Kurenaido', sans-serif", fill: "#333" }}>ご案内します</text>
    <path d="M50 26 L56 34 L58 26" fill="#fff" stroke="#333" strokeWidth="1.2"/>
  </svg>
);

const SignboardPerson = ({ text, flip = false }) => (
  <svg width="80" height="110" viewBox="0 0 80 110" fill="none" style={{ transform: flip ? "scaleX(-1)" : "none" }}>
    <rect x="10" y="2" width="60" height="28" rx="3" stroke="#333" strokeWidth="1.5" fill="#f5f0e8"/>
    {text.split("\n").map((line, i, arr) => (
      <text key={i} x="40" y={arr.length > 1 ? 14 + i * 12 : 20} textAnchor="middle" style={{ fontSize: arr.length > 1 ? "9px" : "10px", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700, fill: "#333" }}>{line}</text>
    ))}
    <path d="M28 30 L28 50" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M52 30 L52 50" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="40" cy="52" r="10" stroke="#333" strokeWidth="1.8" fill="#fff"/>
    <circle cx="37" cy="52" r="1.2" fill="#333"/>
    <circle cx="43" cy="52" r="1.2" fill="#333"/>
    <path d="M37 56 Q40 58 43 56" stroke="#333" strokeWidth="1" fill="none"/>
    <path d="M40 62 L40 82" stroke="#333" strokeWidth="1.8"/>
    <path d="M40 82 L30 105" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M40 82 L50 105" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const ThinkCharacter = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <span style={{ fontFamily: "'Zen Kurenaido', sans-serif", fontSize: "13px", color: "#555", transform: "rotate(-5deg)", display: "block", marginBottom: "4px" }}>考えてみよう。</span>
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
      <circle cx="20" cy="14" r="10" stroke="#333" strokeWidth="1.5" fill="#fff"/>
      <circle cx="17" cy="13" r="1" fill="#333"/>
      <circle cx="23" cy="13" r="1" fill="#333"/>
      <path d="M18 17 Q20 19 22 17" stroke="#333" strokeWidth="1" fill="none"/>
      <path d="M20 24 L20 36" stroke="#333" strokeWidth="1.5"/>
      <path d="M20 28 L12 32" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 28 L28 32" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 36 L14 46" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 36 L26 46" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </div>
);

/* ──────────────── main ──────────────── */
export default function KodomoShinroLP() {
  const [modalOption, setModalOption] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&family=Zen+Kurenaido&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bg: #F5F0E8; --bg-light: #FAF7F2; --text: #333333;
          --text-sub: #666666; --text-light: #999999; --accent: #333333;
          --card-bg: #FFFFFF; --border: #DDDDDD; --max-w: 560px;
          --font-body: 'Noto Sans JP', sans-serif; --font-hand: 'Zen Kurenaido', sans-serif;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
        @keyframes bounceArrow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .option-btn {
          border: 1.5px solid var(--accent); background: var(--bg-light); cursor: pointer;
          transition: all 0.2s ease; font-family: var(--font-body); font-weight: 500;
          font-size: 12px; line-height: 1.4; display: flex; align-items: center;
          justify-content: center; text-align: center; white-space: pre-line;
          min-height: 56px; padding: 10px 4px; border-radius: 6px;
          user-select: none; -webkit-tap-highlight-color: transparent;
        }
        .option-btn:hover { background: #eee8dc; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .option-btn:active { transform: scale(0.97); }
        .cta-btn {
          display: inline-block; border: 2px solid var(--accent); background: transparent;
          color: var(--accent); padding: 14px 32px; font-size: 15px; font-weight: 700;
          font-family: var(--font-body); cursor: pointer; transition: all 0.25s ease;
          text-decoration: none; border-radius: 4px; letter-spacing: 0.5px;
        }
        .cta-btn:hover { background: var(--accent); color: #fff; }
        .map-btn {
          display: inline-block; border: 1.5px solid var(--accent); background: transparent;
          color: var(--accent); padding: 6px 28px; font-size: 13px; font-weight: 500;
          font-family: var(--font-body); cursor: pointer; transition: all 0.2s ease;
          text-decoration: none; border-radius: 4px;
        }
        .map-btn:hover { background: var(--accent); color: #fff; }
        .sns-icon { width: 28px; height: 28px; opacity: 0.6; transition: opacity 0.2s; cursor: pointer; }
        .sns-icon:hover { opacity: 1; }
      `}</style>

      {modalOption && <SchoolModal option={modalOption} onClose={() => setModalOption(null)} />}

      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "0 20px", background: "var(--bg)", minHeight: "100vh" }}>

        {/* Header */}
        <FadeSection>
          <div style={{ textAlign: "center", padding: "20px 0 8px", letterSpacing: "3px", fontSize: "11px", color: "var(--text-light)", fontWeight: 400 }}>
            SUPPORT BY ONE DROP
          </div>
        </FadeSection>

        {/* Hero */}
        <FadeSection delay={0.1}>
          <section style={{ padding: "32px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "var(--text-sub)", marginBottom: "8px" }}>義務教育のその先へ</p>
              <h1 style={{ fontSize: "36px", fontWeight: 900, lineHeight: 1.3, letterSpacing: "2px", margin: 0 }}>こどもの進路<br />案内所</h1>
              <p style={{ marginTop: "16px", fontSize: "15px", fontWeight: 500, lineHeight: 1.6 }}>中学校卒業後の選択肢は<br />1つじゃない。</p>
            </div>
            <div style={{ flexShrink: 0, marginLeft: "8px", marginTop: "-8px" }}><HeroIllustration /></div>
          </section>
        </FadeSection>

        <ScrollArrow />

        {/* Intro */}
        <FadeSection>
          <section style={{ textAlign: "center", padding: "16px 0 8px", lineHeight: 2.2, fontSize: "14px" }}>
            <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: "24px" }}>合格できる学校ではなく、続けられる学校を。</p>
            <p style={{ color: "var(--text-sub)", marginBottom: "16px" }}>
              高校受験で、はじめて受験を経験する方も多いらっしゃると思います。<br />
              高校選びはある種、人生のターニングポイントの1つでもあるとも思います。<br />
              大切なのは、その子に合った学校を選択すること。
            </p>
            <p style={{ color: "var(--text-sub)", marginBottom: "16px" }}>
              情報不足で、選択を狭められないように。<br />
              情報過多で、選択がぶれてしまいすぎないように。
            </p>
            <p style={{ color: "var(--text-sub)" }}>このサイトが、高校選びの相談窓口の1つになることを願っています。</p>
          </section>
        </FadeSection>

        <ScrollArrow />

        {/* Diagnosis */}
        <FadeSection>
          <section style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <SignboardPerson text="おすすめ" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: 1 }}>
                <div style={{ border: "2px solid var(--accent)", borderRadius: "6px", padding: "8px 24px", fontWeight: 700, fontSize: "15px", letterSpacing: "1px" }}>通信制高校診断</div>
                <ThinkCharacter />
              </div>
            </div>
            <div style={{ textAlign: "center", lineHeight: 2, fontSize: "13.5px", color: "var(--text-sub)", marginBottom: "24px" }}>
              <p>10人に1人が通信制高校を選ぶ時代になった今、<br />私たちは子どもの選択肢をどう考えていけばいいのか。</p>
              <p style={{ marginTop: "12px" }}>できるだけ、わが子にあった学校が見つかればと願うのは当たり前のこと。<br />そんな願いを叶えるお手伝いをするための診断サイトです。</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <a href="https://correspondence-school-finder.netlify.app/" className="cta-btn" target="_blank" rel="noopener noreferrer">
                通信制高校診断をはじめる →
              </a>
            </div>
          </section>
        </FadeSection>

        <ScrollArrow />

        {/* School Options — Modal版 */}
        <FadeSection>
          <section style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <SignboardPerson text="選択肢一覧" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
              {schoolOptions.map((opt) => (
                <button key={opt.id} className="option-btn" onClick={() => setModalOption(opt)}
                  aria-label={`${opt.label.replace(/\n/g, "")}の説明を見る`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-light)", lineHeight: 1.8 }}>
              各ボタンをタップすると説明が表示されます
            </p>
          </section>
        </FadeSection>

        <ScrollArrow />

        {/* 不登校セクション */}
        <FadeSection>
          <section style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flexShrink: 0 }}><SignboardPerson text={"選び方の\nポイント"} /></div>
              <div style={{ flex: 1, paddingTop: "8px" }}>
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
                  <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "14px", textAlign: "center" }}>【不登校状態の場合】</p>
                  {[
                    "全日制高校…できれば小規模で負担の軽い高校を選択したい。体調不良がさらにひどくなく、朝から起きれる必要があります。",
                    "定時制高校…昼起きられるなら、自分で勉強するのがしんどいと感じる場合にはおすすめ",
                    "通信制高校…体調面（心と体両方）の不安が大きい場合おすすめです。卒業率やキャンパス内容を重視することをおすすめします（公立と私立の方の卒業率にちがいあり違いがある）",
                    "特別支援学校…一般校より丁寧な支援環境であるが確認できます。療育手帳の必要な場合あり",
                  ].map((text, i) => (
                    <p key={i} style={{ fontSize: "12.5px", color: "var(--text-sub)", lineHeight: 1.8, marginBottom: "10px" }}>
                      <span style={{ color: "var(--accent)", fontWeight: 700, marginRight: "4px" }}>★</span>{text}
                    </p>
                  ))}
                  <p style={{ textAlign: "center", fontWeight: 500, fontSize: "13px", marginTop: "18px", lineHeight: 1.8 }}>
                    我が子の学習の不安度・心の状態・生活リズムを整理してみましょう
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeSection>

        <ScrollArrow />

        {/* FAQ セクション */}
        <FadeSection>
          <FAQSection />
        </FadeSection>

        <ScrollArrow />

        <FadeSection>
          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-sub)", fontFamily: "var(--font-hand)", padding: "8px 0 16px", letterSpacing: "1px" }}>
            誰かに話を聞いてほしいなら・・・
          </p>
        </FadeSection>

        {/* Footer */}
        <FadeSection>
          <footer style={{ padding: "32px 0 40px", textAlign: "center" }}>
            <a href="https://onedrop2025.wixsite.com/my-site-1" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", border: "2px solid var(--accent)", borderRadius: "8px", padding: "8px 24px", fontWeight: 700, fontSize: "16px", letterSpacing: "2px", marginBottom: "20px", color: "var(--text)", textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}>One drop</a>
            <p style={{ fontSize: "14px", marginBottom: "6px", fontWeight: 500 }}>広島県東広島市西条町下見303-1</p>
            <a href="tel:080-1740-4209" style={{ color: "var(--text)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>080-1740-4209</a>
            <div style={{ margin: "12px 0" }}>
              <a className="map-btn" href="https://maps.app.goo.gl/KF9t6frVCMa8K23J6" target="_blank" rel="noopener noreferrer">MAP</a>
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: 2, marginBottom: "8px" }}>
              <p style={{ fontWeight: 500 }}>営業時間</p>
              <p>月・火・木・金　15:00〜21:00</p>
              <p>土　10:00〜18:00</p>
              <p>水・日・祝　休</p>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "16px" }}>お困りごとがあれば、ご相談ください。</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <a href="https://www.instagram.com/onedrop.2025?igsh=MXFrcWxqeGo3OWpzbQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <svg className="sns-icon" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100022640424045&mibextid=wwXIfr&rdid=5Ao6wYiNrSUQSHjz&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16bLFGu3EF%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer">
                <svg className="sns-icon" viewBox="0 0 24 24" fill="var(--accent)"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
            <p style={{ fontSize: "10px", color: "var(--text-light)", marginTop: "24px" }}>© 2025 One drop. All rights reserved.</p>
          </footer>
        </FadeSection>
      </div>
    </>
  );
}
