// React import not needed in React 17+
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, ExternalLink } from "lucide-react";
import { trackEvent } from "../lib/analytics";

const isDev = import.meta.env.DEV;

const StartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent("start_page_view");
  }, []);

  const handleStartDiagnosis = (role: "child" | "parent") => {
    trackEvent("diagnosis_started", { role });
    navigate(`/questions?role=${role}`);
  };

  const devNav = async (role: "child" | "parent" | "both") => {
    const { seedDevData } = await import("../lib/devSeed");
    navigate(seedDevData(role));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration: Warm Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

      <div className="glass-card p-8 md:p-12 rounded-[2.5rem] max-w-lg w-full text-center relative z-10 shadow-xl border-white/60 mb-8">
        <div className="mb-8">
          <h1 className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-stone-700 mb-3 tracking-tight leading-relaxed">
              通信制高校、どう選ぶ？
            </div>
            <div className="text-lg md:text-xl font-normal text-orange-500 tracking-wider pl-4">
              わたしの こだわり 診断
            </div>
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed mt-6">
            このツールは、あなたの気持ちや価値観をゆっくりと整理しながら、<br />
            自分に合った学校選びのヒントを見つけるお手伝いをします。<br />
            <span className="text-stone-400 text-xs mt-1 inline-block">正解はありません。リラックスして進めてくださいね。</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleStartDiagnosis("child")}
            className="group relative bg-white hover-hover:hover:bg-orange-50 border-2 border-transparent hover-hover:hover:border-orange-200 text-left p-6 rounded-2xl shadow-sm hover-hover:hover:shadow-md transition-all duration-300 flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center hover-hover:group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div>
              <span className="block font-bold text-base md:text-lg text-stone-700 hover-hover:group-hover:text-orange-700 transition-colors">生徒として診断する</span>
              <span className="block text-xs text-stone-400">自分の気持ちを整理したい方</span>
            </div>
          </button>

          <button
            onClick={() => handleStartDiagnosis("parent")}
            className="group relative bg-white hover-hover:hover:bg-teal-50 border-2 border-transparent hover-hover:hover:border-teal-200 text-left p-6 rounded-2xl shadow-sm hover-hover:hover:shadow-md transition-all duration-300 flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center hover-hover:group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div>
              <span className="block font-bold text-base md:text-lg text-stone-700 hover-hover:group-hover:text-teal-700 transition-colors">保護者として診断する</span>
              <span className="block text-xs text-stone-400">お子様の学校選びを考えたい方</span>
            </div>
          </button>
        </div>

        <div className="mt-8 text-xs text-stone-400">
          所要時間：約3-4分（全21問）
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="relative z-10 max-w-lg w-full text-left mt-4 mb-8 px-2">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-700 mb-2">この診断でわかること</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              通信制高校を選ぶうえで大切な<strong>8つの軸</strong>（通学頻度・費用・オンライン適性・自己管理力・進路志向・学校生活・メンタルヘルス・専門課程）について、あなた自身の優先順位をレーダーチャートで可視化します。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-stone-700 mb-2">こんな方におすすめ</h2>
            <ul className="text-sm text-stone-500 leading-relaxed space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">●</span>通信制高校への進学を検討している中学生・高校生</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">●</span>不登校の状態から進路を考えたい方</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">●</span>お子さまの学校選びをサポートしたい保護者の方</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">●</span>全日制・通信制・定時制の違いを整理したい方</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-stone-700 mb-2">診断の特徴</h2>
            <ul className="text-sm text-stone-500 leading-relaxed space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">✓</span>登録不要・資料請求なしで今すぐ始められます</li>
              <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">✓</span>所要時間は約3〜4分（全21問）</li>
              <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">✓</span>結果はレーダーチャートとPDFレポートで確認</li>
              <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">✓</span>生徒本人と保護者、それぞれの視点で診断可能</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-stone-200/50">
            <p className="text-xs text-stone-400 leading-relaxed">
              この診断は、学校選びの優先順位を整理するためのヒントとして設計されています。特定の学校を推薦するものではありません。資料請求・会員登録は一切不要です。
              進路についてより詳しく知りたい方は<a href="https://kodomo-shinro.jp/" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">こどもの進路案内所</a>もご覧ください。
            </p>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="relative z-10 text-center">
        <p className="text-[10px] text-stone-400 mb-1">Produced by</p>
        <a
          href="https://onedrop2025.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-stone-600 font-bold hover:text-orange-600 transition-colors bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50"
        >
          <span>One drop 個別対話型サポート塾</span>
          <ExternalLink size={12} className="opacity-50" />
        </a>
      </footer>

      {isDev && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white text-xs rounded-xl p-3 space-y-2 backdrop-blur-sm">
          <p className="font-bold text-yellow-300">DEV shortcuts</p>
          <button onClick={() => devNav("child")} className="block w-full text-left px-2 py-1 rounded hover:bg-white/20 bg-transparent border-none text-white cursor-pointer text-xs">
            → Result（生徒）
          </button>
          <button onClick={() => devNav("parent")} className="block w-full text-left px-2 py-1 rounded hover:bg-white/20 bg-transparent border-none text-white cursor-pointer text-xs">
            → Result（保護者）
          </button>
          <button onClick={() => devNav("both")} className="block w-full text-left px-2 py-1 rounded hover:bg-white/20 bg-transparent border-none text-white cursor-pointer text-xs">
            → Result（親子マッチング）
          </button>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default StartPage;