import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import Avatar from "../components/Avatar";
import JoinScreen from "./JoinScreen";
import RequestsPage from "./RequestsPage";
import { IconMenu, IconSearch, IconUsers, IconBell, IconDots, IconAttach, IconEmoji, IconMic, IconSend } from "../components/Icons";
import IconButton from "../components/IconButton";
import { getInitials, AVATAR_COLORS } from "../utils/chatUtils";
import { useChat } from "../context/ChatContext";


const SERVER_URL = "http://localhost:5000";
export default function ChatRoom() {

    const {
        username,
        room,
        joined,
        messages,
        onlineUsers,
        typingUser,
        joinRoom,
        sendMessage,
        sendTypingStatus
    } = useChat();

    // ── UI ──────────────────────────────────────────────────────────────────────
    const [activeNav, setActiveNav] = useState("public");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    // ── Requests state (lifted for merged header) ────────────────────────────────
    const [reqTab, setReqTab] = useState("incoming");
    const [reqIncomingCount, setReqIncomingCount] = useState(4);
    const [reqSentCount, setReqSentCount] = useState(3);

    // ── Chat ────────────────────────────────────────────────────────────────────

    const [inputVal, setInputVal] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // ── Refs ────────────────────────────────────────────────────────────────────
    const feedRef = useRef(null);

    const typingTimeout = useRef(null);

    // ── Auto-scroll ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (feedRef.current)
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }, [messages, typingUser]);

    // ── Socket setup ────────────────────────────────────────────────────────────

    // ── Body scroll lock (mobile sidebar) ───────────────────────────────────────
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    // ── Close sidebar on desktop resize ─────────────────────────────────────────
    useEffect(() => {
        function onResize() { if (window.innerWidth >= 768) setSidebarOpen(false); }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // ── Join handler ─────────────────────────────────────────────────────────────
    function handleJoin(name, roomName) {
        joinRoom(name, roomName);
    }

    // ── Send message ─────────────────────────────────────────────────────────────
    function handleSend() {
        const text = inputVal.trim();
        if (!text) return;

        sendMessage(text);
        setInputVal("");

        // Clear typing
        clearTimeout(typingTimeout.current);
        setIsTyping(false);
        sendTypingStatus(false)
    }

    // ── Typing indicator ──────────────────────────────────────────────────────────
    function handleTyping(e) {
        setInputVal(e.target.value);


        if (!isTyping) {
            setIsTyping(true);
            sendTypingStatus(true);
        }
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
            sendTypingStatus(false);
        }, 1500);
    }

    // ── Enter key ─────────────────────────────────────────────────────────────────
    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // ── Gate: show join screen first ──────────────────────────────────────────────
    if (!joined) return <JoinScreen onJoin={handleJoin} />;

    // ─────────────────────────────────────────────────────────────────────────────

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');
        * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%           { opacity: 1;   transform: scale(1); }
        }
        .typing-dot { animation: blink 1.2s infinite ease-in-out; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @media (min-width: 768px) {
          .sidebar-anim { animation: slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        }
        .overlay-anim { animation: fadeIn 0.2s ease both; }
        .feed-scroll::-webkit-scrollbar { width: 3px; }
        .feed-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 2px; }
        .no-scroll::-webkit-scrollbar { width: 0; }
      `}</style>

            <div className="flex h-screen overflow-hidden relative" style={{ background: "#F0EFF8" }}>

                {/* Noise overlay */}
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 overlay-anim md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ══ SIDEBAR ══ */}
                <Sidebar
                    username={username}
                    room={room}
                    onlineUsers={onlineUsers}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    activeNav={activeNav}
                    setActiveNav={setActiveNav}
                />

                {/* ══ MAIN ══ */}
                <div className="relative z-10 flex flex-col flex-1 min-w-0" style={{ background: "rgba(255,255,255,0.12)" }}>

                    {/* ══ Top Bar (context-aware) ══ */}
                    <header
                        className="flex-shrink-0 border-b border-slate-300"
                        style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)" }}
                    >
                        {/* ── Main row ── */}
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 h-[60px] sm:h-[68px] md:h-[76px]">
                            <div className="flex items-center gap-3">
                                {/* Hamburger */}
                                <button
                                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-black/5 transition-colors flex-shrink-0"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <IconMenu />
                                </button>

                                {/* Context title */}
                                {activeNav === "requests" ? (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-base sm:text-lg font-bold tracking-tight" style={{ color: "#8200F6" }}>Connections</span>
                                        <p className="text-[11px] font-medium" style={{ fontFamily: "'DM Mono',monospace", color: "#A78BFA" }}>Arcane · request manager</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-0.5 sm:gap-1">
                                        <span className="text-base sm:text-lg font-bold tracking-tight" style={{ color: "#8200F6" }}>#{room}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
                                            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{onlineUsers.length} online</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Search — chat only */}
                                {activeNav !== "requests" && (
                                    <>
                                        <div
                                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-400 w-44 lg:w-52"
                                            style={{ background: "#fff" }}
                                        >
                                            <IconSearch />
                                            <input type="text" placeholder="Search messages…" className="bg-transparent border-none outline-none text-[13px] text-slate-600 placeholder-slate-400 w-full" />
                                        </div>
                                        <button className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-black/5">
                                            <IconSearch />
                                        </button>
                                        <IconButton title="Online users" onClick={() => setShowUsers(v => !v)}>
                                            <IconUsers />
                                        </IconButton>
                                    </>
                                )}

                                {/* Bell — with incoming badge on requests view */}
                                <div className="relative">
                                    <IconButton title="Notifications"><IconBell /></IconButton>
                                    {activeNav === "requests" && reqIncomingCount > 0 && (
                                        <span
                                            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white pointer-events-none"
                                            style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)" }}
                                        >
                                            {reqIncomingCount}
                                        </span>
                                    )}
                                </div>

                                <span className="hidden sm:block">
                                    <IconButton title="More"><IconDots /></IconButton>
                                </span>

                                {/* My avatar */}
                                <div
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[12px] sm:text-[13px] font-bold cursor-pointer border-2 border-purple-200"
                                    style={{ background: "linear-gradient(135deg,#C0C1FF,#DDB7FF)", color: "#3b0d8c" }}
                                >
                                    {getInitials(username)}
                                </div>
                            </div>
                        </div>

                        {/* ── Tabs row (requests view only) ── */}
                        {activeNav === "requests" && (
                            <div className="px-4 sm:px-6 md:px-8 pb-3">
                                <div
                                    className="flex gap-1 p-1 rounded-2xl w-fit"
                                    style={{ background: "#F5F3FF", border: "1px solid #EDE9FE" }}
                                >
                                    {[
                                        { id: "incoming", label: "Incoming", count: reqIncomingCount },
                                        { id: "sent",     label: "Sent",     count: reqSentCount     },
                                        { id: "send",     label: "Send",     count: null             },
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setReqTab(t.id)}
                                            className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200"
                                            style={reqTab === t.id
                                                ? { background: "#fff", color: "#7C3AED", boxShadow: "0 1px 6px rgba(109,40,217,0.12)", border: "1px solid rgba(167,139,250,0.3)" }
                                                : { color: "#A78BFA", border: "1px solid transparent" }
                                            }
                                        >
                                            {t.label}
                                            {t.count != null && t.count > 0 && (
                                                <span
                                                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                                    style={reqTab === t.id
                                                        ? { background: "#EDE9FE", color: "#7C3AED" }
                                                        : { background: "rgba(167,139,250,0.15)", color: "#A78BFA" }
                                                    }
                                                >
                                                    {t.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Body row — conditionally show Requests page or Chat feed */}
                    {activeNav === "requests" ? (
                        <RequestsPage
                            tab={reqTab}
                            setTab={setReqTab}
                            onIncomingChange={setReqIncomingCount}
                            onSentChange={setReqSentCount}
                        />
                    ) : (
                        <>
                            <div className="flex flex-1 min-h-0">

                                {/* Feed */}
                                <div
                                    ref={feedRef}
                                    className="feed-scroll flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 lg:px-14 py-6 sm:py-8 md:py-10"
                                >
                                    <div className="flex items-center justify-center mb-6 sm:mb-8">
                                        <span
                                            className="px-4 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase"
                                            style={{ fontFamily: "'DM Mono', monospace", background: "rgba(216,26,204,0.13)", color: "#b800ae" }}
                                        >
                                            Today · #{room}
                                        </span>
                                    </div>

                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-40">
                                            <span className="text-3xl">💬</span>
                                            <p className="text-sm text-slate-500">No messages yet — say hi!</p>
                                        </div>
                                    )}

                                    {messages.map((msg, i) => (
                                        <MessageBubble
                                            key={msg._id || msg.id || i}
                                            msg={msg}
                                            currentUser={username}
                                        />
                                    ))}

                                    {/* Typing indicator */}
                                    {typingUser && typingUser !== username && (
                                        <TypingIndicator username={typingUser} />
                                    )}
                                </div>

                                {/* Online users side panel (desktop only, toggleable) */}
                                {showUsers && (
                                    <div
                                        className="hidden md:flex flex-col w-56 border-l border-slate-200/60 overflow-y-auto no-scroll py-6 px-4 gap-3 flex-shrink-0"
                                        style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)" }}
                                    >
                                        <p
                                            className="text-[10px] font-bold tracking-widest uppercase opacity-60 px-2"
                                            style={{ fontFamily: "'DM Mono', monospace", color: "#9896A8" }}
                                        >
                                            Online · {onlineUsers.length}
                                        </p>
                                        {onlineUsers.map((u, i) => {
                                            const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
                                            return (
                                                <div key={u} className="flex items-center gap-2.5 px-2">
                                                    <div className="relative">
                                                        <Avatar initials={getInitials(u)} gradFrom={c.gradFrom} gradTo={c.gradTo} textColor={c.textColor} size="sm" />
                                                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white" style={{ background: "#34D399" }} />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 truncate">
                                                        {u === username ? `${u} (you)` : u}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Input Bar */}
                            <footer
                                className="px-3 sm:px-6 md:px-10 pb-4 sm:pb-6 pt-3 sm:pt-4"
                                style={{ background: "linear-gradient(0deg,#fff 0%,rgba(255,255,255,0) 100%)" }}
                            >
                                <div
                                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-3xl border border-white/40 transition-all duration-200"
                                    style={{
                                        background: "rgba(255,255,255,0.25)",
                                        backdropFilter: "blur(20px)",
                                        WebkitBackdropFilter: "blur(20px)",
                                        boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                                    }}
                                >
                                    <IconButton title="Attach"><IconAttach /></IconButton>
                                    <span className="hidden sm:block">
                                        <IconButton title="Emoji"><IconEmoji /></IconButton>
                                    </span>
                                    <div className="w-px h-5 bg-black/10 flex-shrink-0 hidden sm:block" />
                                    <input
                                        type="text"
                                        value={inputVal}
                                        onChange={handleTyping}
                                        onKeyDown={handleKeyDown}
                                        placeholder={`Message #${room}…`}
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 min-w-0"
                                    />
                                    <span className="hidden sm:block">
                                        <IconButton title="Voice"><IconMic /></IconButton>
                                    </span>
                                    <button
                                        onClick={handleSend}
                                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[#0D0096] flex-shrink-0 transition-all duration-200 hover:scale-105"
                                        style={{
                                            background: "linear-gradient(135deg,#C0C1FF 0%,#DDB7FF 100%)",
                                            boxShadow: "0 4px 14px rgba(150,151,255,0.4)",
                                        }}
                                    >
                                        <IconSend />
                                    </button>
                                </div>
                            </footer>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}