import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api/auth.js";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name
    .replace(/[._]/g, " ")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getToken() {
  return localStorage.getItem("token");
}

// Deterministic avatar palette based on username
const PALETTES = [
  { gradFrom: "#EDE9FE", gradTo: "#DDD6FE", textColor: "#5B21B6" },
  { gradFrom: "#DBEAFE", gradTo: "#BFDBFE", textColor: "#1E40AF" },
  { gradFrom: "#D1FAE5", gradTo: "#A7F3D0", textColor: "#065F46" },
  { gradFrom: "#FCE7F3", gradTo: "#FBCFE8", textColor: "#9D174D" },
  { gradFrom: "#FEF3C7", gradTo: "#FDE68A", textColor: "#92400E" },
];

function getPalette(username = "") {
  const sum = [...username].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTES[sum % PALETTES.length];
}

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────

function Avatar({ username, gradFrom, gradTo, textColor, size = "md" }) {
  const sz = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-11 h-11 text-sm",
  }[size];
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`}
      style={{
        background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
        color: textColor,
      }}
    >
      {getInitials(username)}
    </div>
  );
}

// ─── INCOMING CARD ────────────────────────────────────────────────────────────
// onAccept / onDecline are async functions provided by the parent (RequestsPage)

function IncomingCard({ user, onAccept, onDecline }) {
  const [state, setState] = useState("idle"); // idle | busy | accepted | declined

  async function accept() {
    setState("busy");
    try {
      await onAccept(user.id);
      setState("accepted");
    } catch {
      setState("idle");
    }
  }

  async function decline() {
    setState("busy");
    try {
      await onDecline(user.id);
      setState("declined");
    } catch {
      setState("idle");
    }
  }

  const palette = getPalette(user.username);
  const isIdle = state === "idle";
  const isBusy = state === "busy";
  const isDone = state === "accepted" || state === "declined";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300"
      style={{
        background:
          state === "accepted"
            ? "rgba(16,185,129,0.06)"
            : state === "declined"
              ? "rgba(239,68,68,0.04)"
              : "#FFFFFF",
        border:
          state === "accepted"
            ? "1px solid rgba(16,185,129,0.22)"
            : state === "declined"
              ? "1px solid rgba(239,68,68,0.16)"
              : "1px solid #E5E4F0",
        boxShadow: isIdle ? "0 1px 4px rgba(109,40,217,0.06)" : "none",
        opacity: isBusy || isDone ? 0.65 : 1,
        transform: isBusy || isDone ? "scale(0.985)" : "scale(1)",
      }}
    >
      <Avatar {...palette} username={user.username} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-800 tracking-tight truncate">
            @{user.username}
          </span>
          <span className="text-[10px] text-slate-400 flex-shrink-0">
            {user.time}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">Arcane User</p>
      </div>

      {!isDone ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            disabled={isBusy}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-50 transition-all duration-150 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <button
            onClick={accept}
            disabled={isBusy}
            className="h-8 px-3.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            style={{
              background: "linear-gradient(135deg,#7C3AED,#A78BFA)",
              color: "#fff",
              boxShadow: "0 2px 10px rgba(124,58,237,0.28)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {isBusy ? "…" : "Accept"}
          </button>
        </div>
      ) : (
        <span
          className="text-[11px] font-semibold flex-shrink-0 px-2.5 py-1 rounded-full"
          style={
            state === "accepted"
              ? { background: "#D1FAE5", color: "#065F46" }
              : { background: "#FEE2E2", color: "#B91C1C" }
          }
        >
          {state === "accepted" ? "✓ Accepted" : "✕ Declined"}
        </span>
      )}
    </div>
  );
}

// ─── SENT CARD ────────────────────────────────────────────────────────────────
// onCancel is an async function provided by the parent (RequestsPage)

function SentCard({ user, onCancel }) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  async function cancel() {
    setCancelling(true);
    try {
      await onCancel(user.id);
      setCancelled(true);
    } catch {
      setCancelling(false);
    }
  }

  const palette = getPalette(user.username);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E4F0",
        boxShadow: "0 1px 4px rgba(109,40,217,0.05)",
        opacity: cancelled ? 0.45 : 1,
      }}
    >
      <Avatar {...palette} username={user.username} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-800 tracking-tight truncate">
            @{user.username}
          </span>
          <span className="text-[10px] text-slate-400 flex-shrink-0">
            {user.time}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">Arcane User</p>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={
            user.status === "accepted"
              ? { background: "#D1FAE5", color: "#065F46" }
              : user.status === "rejected"
                ? { background: "#FEE2E2", color: "#B91C1C" }
                : { background: "#F3F4F6", color: "#9CA3AF" }
          }
        >
          {user.status === "accepted"
            ? "● Accepted"
            : user.status === "rejected"
              ? "● Declined"
              : "○ Pending"}
        </span>
        {!cancelled && user.status === "pending" && (
          <button
            onClick={cancel}
            disabled={cancelling}
            className="text-[11px] text-slate-400 hover:text-red-500 transition-colors font-medium disabled:opacity-40"
          >
            {cancelling ? "…" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SEND REQUEST FORM ────────────────────────────────────────────────────────

function SendRequestForm({ onSent }) {
  const [username, setUsername] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    if (!username.trim() || status !== "idle") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const token = getToken();

      // 1. Fetch user
      const userRes = await API.get(
        `/user/search?username=${encodeURIComponent(username.trim())}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const toUserId = userRes.data._id;

      // ❗ Self check AFTER fetch
      const currentUserId = JSON.parse(atob(token.split(".")[1])).userId;

      if (toUserId === currentUserId) {
        setErrorMsg("You cannot send request to yourself");
        setStatus("error");
        return;
      }

      // 2. Send request
      await API.post(
        "/request/send",
        { to: toUserId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStatus("sent");
      onSent?.();

      setTimeout(() => {
        setStatus("idle");
        setUsername("");
        setNote("");
      }, 2500);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send request";
      setErrorMsg(msg);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const canSend = username.trim().length > 0 && status === "idle";

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3.5"
      style={{ background: "#FAFAFE", border: "1px solid #EDE9FE" }}
    >
      {/* Username */}
      <div>
        <label
          className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5"
          style={{ fontFamily: "'DM Mono',monospace" }}
        >
          Username
        </label>
        <div
          className="flex items-center gap-2 px-3.5 py-3 rounded-xl transition-all duration-150"
          style={{
            background: "#fff",
            border: `1px solid ${username ? "#A78BFA" : "#E5E4F0"}`,
            boxShadow: username ? "0 0 0 3px rgba(167,139,250,0.12)" : "none",
          }}
        >
          <span
            className="font-bold text-sm select-none"
            style={{ color: "#A78BFA" }}
          >
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSend && handleSend()}
            placeholder="enter username"
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-700 placeholder-slate-300"
          />
          {username && (
            <button
              onClick={() => setUsername("")}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Note */}
      <div>
        <label
          className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5"
          style={{ fontFamily: "'DM Mono',monospace" }}
        >
          Note{" "}
          <span className="normal-case tracking-normal font-normal text-slate-300">
            — optional
          </span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Hey, I'd love to connect on Arcane…"
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl text-[12.5px] text-slate-600 placeholder-slate-300 resize-none outline-none transition-all duration-150"
          style={{
            background: "#fff",
            border: `1px solid ${note ? "#A78BFA" : "#E5E4F0"}`,
            boxShadow: note ? "0 0 0 3px rgba(167,139,250,0.10)" : "none",
          }}
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-[11px] text-red-500 font-medium">{errorMsg}</p>
      )}

      {/* Button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="w-full py-3 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={
          status === "sent"
            ? {
                background: "#D1FAE5",
                color: "#065F46",
                border: "1px solid #A7F3D0",
                cursor: "default",
              }
            : status === "sending"
              ? {
                  background: "linear-gradient(135deg,#7C3AED,#A78BFA)",
                  color: "#fff",
                  opacity: 0.75,
                  cursor: "wait",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
                }
              : status === "error"
                ? { background: "#FEE2E2", color: "#B91C1C", cursor: "default" }
                : canSend
                  ? {
                      background: "linear-gradient(135deg,#7C3AED,#A78BFA)",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(124,58,237,0.28)",
                    }
                  : {
                      background: "#F3F4F6",
                      color: "#CBD5E1",
                      cursor: "not-allowed",
                    }
        }
      >
        {status === "sending" && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {status === "sent" && (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        )}
        {status === "sent" ? (
          "Request Sent!"
        ) : status === "sending" ? (
          "Sending…"
        ) : status === "error" ? (
          "Try again"
        ) : (
          <>
            <span>Send Request</span>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState({ emoji, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background: "#F5F3FF", border: "1px solid #EDE9FE" }}
      >
        {emoji}
      </div>
      <p className="text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RequestsPage({
  tab,
  setTab,
  onIncomingChange,
  onSentChange,
}) {
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch from API ─────────────────────────────────────────────────────────
  async function fetchRequests() {
    try {
      const token = getToken();
      const res = await API.get("/request/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncoming(res.data.incoming ?? []);
      setSent(res.data.sent ?? []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  // ── Sync counts up to ChatRoom header ─────────────────────────────────────
  useEffect(() => {
    onIncomingChange?.(incoming.length);
  }, [incoming.length]);
  useEffect(() => {
    onSentChange?.(sent.length);
  }, [sent.length]);

  // ── Action handlers (defined here, passed as callbacks to cards) ───────────
  async function handleAccept(requestId) {
    await API.post(
      "/request/respond",
      { requestId, action: "accepted" },
      { headers: { Authorization: `Bearer ${getToken()}` } },
    );
    await fetchRequests();
  }

  async function handleDecline(requestId) {
    await API.post(
      "/request/respond",
      { requestId, action: "rejected" },
      { headers: { Authorization: `Bearer ${getToken()}` } },
    );
    await fetchRequests();
  }

  async function handleCancel(requestId) {
    await API.post(
      "/request/cancel",
      { requestId },
      { headers: { Authorization: `Bearer ${getToken()}` } },
    );
    await fetchRequests();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="req-enter flex flex-col flex-1 min-h-0 min-w-0">
      <style>{`
        @keyframes req-fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes req-fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes req-popIn   { from{opacity:0;transform:scale(0.97) translateY(5px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .req-enter       { animation: req-fadeUp 0.38s cubic-bezier(.22,1,.36,1) both; }
        .req-tab-content { animation: req-fadeIn 0.18s ease both; }
        .req-card-pop    { animation: req-popIn 0.2s ease both; }
        .req-scroll::-webkit-scrollbar       { width:3px; }
        .req-scroll::-webkit-scrollbar-thumb { background:rgba(167,139,250,0.3); border-radius:2px; }
      `}</style>

      {/* ── Scrollable body ── */}
      <div className="req-scroll flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 lg:px-14 py-6 sm:py-8">
        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg
              className="w-6 h-6 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "#A78BFA" }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}

        {!loading && (
          <>
            {/* INCOMING */}
            {tab === "incoming" && (
              <div className="req-tab-content flex flex-col gap-2.5 max-w-2xl">
                <p
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1"
                  style={{ fontFamily: "'DM Mono',monospace" }}
                >
                  {incoming.length > 0
                    ? `${incoming.length} pending`
                    : "No requests"}
                </p>
                {incoming.length === 0 ? (
                  <EmptyState emoji="📭" label="You're all caught up!" />
                ) : (
                  incoming.map((req, i) => (
                    <div
                      key={req._id}
                      className="req-card-pop"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <IncomingCard
                        user={{
                          id: req._id,
                          username: req.from?.username ?? "unknown",
                          time: relativeTime(req.createdAt),
                        }}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SENT */}
            {tab === "sent" && (
              <div className="req-tab-content flex flex-col gap-2.5 max-w-2xl">
                <p
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1"
                  style={{ fontFamily: "'DM Mono',monospace" }}
                >
                  {sent.length > 0
                    ? `${sent.length} awaiting response`
                    : "None sent yet"}
                </p>
                {sent.length === 0 ? (
                  <EmptyState emoji="📤" label="No sent requests yet" />
                ) : (
                  sent.map((req, i) => (
                    <div
                      key={req._id}
                      className="req-card-pop"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <SentCard
                        user={{
                          id: req._id,
                          username: req.to?.username ?? "unknown",
                          time: relativeTime(req.createdAt),
                          status: req.status,
                        }}
                        onCancel={handleCancel}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SEND */}
            {tab === "send" && (
              <div className="req-tab-content max-w-md">
                <p
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3"
                  style={{ fontFamily: "'DM Mono',monospace" }}
                >
                  Send a connection request
                </p>
                <SendRequestForm onSent={fetchRequests} />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Pinned footer ── */}
      <div
        className="flex-shrink-0 px-4 sm:px-8 md:px-10 lg:px-14 py-3 flex items-center justify-between"
        style={{
          borderTop: "1px solid rgba(167,139,250,0.15)",
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          className="text-[11px] text-slate-400"
          style={{ fontFamily: "'DM Mono',monospace" }}
        >
          Arcane · connections
        </span>
        <span className="text-[11px] text-slate-400">
          {incoming.length} incoming · {sent.length} sent
        </span>
      </div>
    </div>
  );
}
