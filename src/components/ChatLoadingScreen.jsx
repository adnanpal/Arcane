import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
const ChatLoadingScreen = () => {
  const navigate = useNavigate();
  const { joinRoom, socketReady } = useChat();

  // ✅ 1. Join room ONLY when socket is ready
  useEffect(() => {
    if (!socketReady) return;

    const stored = JSON.parse(localStorage.getItem("chatUser"));
    const username = stored?.username;
    const room = stored?.room;

    if (username && room) {
      joinRoom(username, room);
    }
  }, [socketReady]);

  // ✅ 2. Timer ALWAYS runs once
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("⏳ Redirecting to chat...");
      navigate("/chat");
      localStorage.removeItem("chatUser");
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#131313] rounded-[16px] overflow-hidden flex font-sans text-white antialiased selection:bg-purple-500/30">
      {/* Custom Styles for Animations & Gradients */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #1C1B1B 25%, #2e2d2d 50%, #1C1B1B 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite linear;
        }
        @keyframes spin-custom {
          to { stroke-dashoffset: -260; }
        }
        .ring-progress-anim {
          stroke-dasharray: 80 260;
          stroke-dashoffset: 0;
          animation: spin-custom 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes chip-pop {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-chip-1 { animation: chip-pop 0.4s 0.6s ease both; }
        .animate-chip-2 { animation: chip-pop 0.4s 0.85s ease both; }
      `}</style>

      {/* Ambient Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[380px] h-[320px] bg-[#C0C1FF]/[0.06] blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[380px] h-[320px] bg-[#DDB7FF]/[0.06] blur-[60px] rounded-full pointer-events-none" />

      {/* SIDEBAR SKELETON */}
      <aside className="w-[260px] min-w-[260px] bg-[#1a1919] border-r border-[#222] p-5 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="shimmer-bg w-10 h-10 rounded-full" />
          <div className="shimmer-bg w-[110px] h-[14px] rounded-full" />
        </div>
        <div className="shimmer-bg w-14 h-[7px] opacity-40 rounded-full" />
        <nav className="flex flex-col gap-[14px]">
          {[180, 120, 150].map((width, i) => (
            <div key={i} className="flex items-center gap-[14px]">
              <div className="shimmer-bg w-7 h-7 rounded-lg shrink-0" />
              <div
                className={`shimmer-bg h-[11px] rounded-full`}
                style={{ width: `${width}px` }}
              />
            </div>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <div className="shimmer-bg w-full h-11 rounded-[44px]" />
          <div className="shimmer-bg w-full h-11 rounded-[44px]" />
        </div>
      </aside>

      {/* MAIN CONTENT SKELETON */}
      <main className="flex-1 flex flex-col bg-[#161616]">
        {/* Topbar */}
        <header className="h-[68px] border-b border-[#222] flex items-center justify-between px-7 shrink-0">
          <div className="flex items-center gap-[14px]">
            <div className="shimmer-bg w-11 h-11 rounded-full" />
            <div className="flex flex-col gap-[7px]">
              <div className="shimmer-bg w-[140px] h-[13px] rounded-full" />
              <div className="shimmer-bg w-[72px] h-[7px] opacity-40 rounded-full" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shimmer-bg w-[38px] h-[38px] rounded-full" />
            <div className="shimmer-bg w-[38px] h-[38px] rounded-full" />
          </div>
        </header>

        {/* Feed Messages */}
        <section className="flex-1 p-7 flex flex-col gap-5 overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="shimmer-bg w-9 h-9 rounded-full shrink-0" />
            <div className="shimmer-bg w-[55%] h-20 rounded-[14px]" />
          </div>
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="shimmer-bg w-9 h-9 rounded-full shrink-0" />
            <div className="shimmer-bg w-[44%] h-[56px] rounded-[14px]" />
          </div>
          <div className="flex items-start gap-3">
            <div className="shimmer-bg w-9 h-9 rounded-full shrink-0" />
            <div className="shimmer-bg w-[48%] h-28 rounded-[14px]" />
          </div>
        </section>

        {/* Input Bar */}
        <footer className="h-[62px] border-t border-[#222] flex items-center px-5 shrink-0">
          <div className="shimmer-bg w-full h-[46px] rounded-[14px]" />
        </footer>
      </main>

      {/* OVERLAY MODAL */}
      <div className="absolute inset-0 bg-[#131313]/55 backdrop-blur-[1px] flex items-center justify-center z-10">
        <div className="w-[400px] h-[360px] bg-white/[0.07] border border-[#908fa0]/35 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Circular Progress */}
          <div className="relative w-28 h-28 flex items-center justify-center mb-2">
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              className="rotate-[-90deg]"
            >
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C0C1FF" />
                  <stop offset="100%" stopColor="#DDB7FF" />
                </linearGradient>
              </defs>
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="url(#ringGrad)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                className="ring-progress-anim"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
                  fill="rgba(192,193,255,0.85)"
                />
              </svg>
            </div>
          </div>

          {/* Text Block */}
          <div className="text-center mb-[6px]">
            <h2 className="text-[22px] font-bold text-[#e8e6e0] tracking-tight leading-tight mb-[6px]">
              Curator Network
            </h2>
            <p className="text-[13px] text-[#c8c6d2]/65 tracking-wide font-normal">
              Resuming your conversations…
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-[14px] my-4">
            <div className="w-11 h-[1px] bg-[#908fa0]/30" />
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-[#c8c6d2]/35 font-medium">
              Establishing session
            </span>
            <div className="w-11 h-[1px] bg-[#908fa0]/30" />
          </div>

          {/* Chips */}
          <div className="flex gap-2">
            <div className="animate-chip-1 px-[14px] py-[5px] bg-white/[0.06] border border-[#908fa0]/25 rounded-[4px] font-mono text-[10px] tracking-wider uppercase text-[#c8c6d2]/50">
              Syncing encrypted logs
            </div>
            <div className="animate-chip-2 px-[14px] py-[5px] bg-white/[0.06] border border-[#908fa0]/25 rounded-[4px] font-mono text-[10px] tracking-wider uppercase text-[#c8c6d2]/50">
              AI context loaded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLoadingScreen;
