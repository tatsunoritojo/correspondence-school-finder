// React import not needed in React 17+
import { useNavigate } from "react-router-dom";
import { User, Users, ExternalLink } from "lucide-react";

const StartPage = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate("/questions?role=child")}
            className="group relative bg-white hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 text-left p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div>
              <span className="block font-bold text-lg text-stone-700 group-hover:text-orange-700 transition-colors">生徒として診断する</span>
              <span className="block text-xs text-stone-400">自分の気持ちを整理したい方</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/questions?role=parent")}
            className="group relative bg-white hover:bg-teal-50 border-2 border-transparent hover:border-teal-200 text-left p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div>
              <span className="block font-bold text-lg text-stone-700 group-hover:text-teal-700 transition-colors">保護者として診断する</span>
              <span className="block text-xs text-stone-400">お子様の学校選びを考えたい方</span>
            </div>
          </button>
        </div>

        <div className="mt-8 text-xs text-stone-400">
          所要時間：約3-4分（全21問）
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 text-center">
        <p className="text-[10px] text-stone-400 mb-1">Produced by</p>
        <a
          href="https://onedrop2025.wixsite.com/my-site-1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-stone-600 font-bold hover:text-orange-600 transition-colors bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50"
        >
          <span>One dorp 個別対話型サポート塾</span>
          <ExternalLink size={12} className="opacity-50" />
        </a>
      </footer>

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