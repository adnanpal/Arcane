import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

export default function JoinScreen() {
  const navigate = useNavigate();

  const { joinRoom } = useChat();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      joinRoom(username.trim(), room.trim());
      navigate("/loading", {
        state: {
          username: username.trim(),
          room: room.trim(),
        },
      });
    }
  }

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ background: "#F0EFF8" }}
    >
      <div
        className="flex flex-col gap-5 w-80 p-8 rounded-3xl border border-white/40"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex flex-col gap-1 mb-2">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#8200F6" }}
          >
            Curator Network
          </span>
          <span className="text-xs text-slate-400">
            Join a room to start chatting
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 px-1">
              Username
            </label>
            <input
              autoFocus
              className="border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-purple-300 transition-colors"
              style={{ background: "rgba(255,255,255,0.8)" }}
              placeholder="e.g. adnan_pal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 px-1">
              Room
            </label>
            <input
              className="border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-purple-300 transition-colors"
              style={{ background: "rgba(255,255,255,0.8)" }}
              placeholder="e.g. general"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "#C0C1FF",
              color: "#0D0096",
              boxShadow: "0 4px 14px rgba(150,151,255,0.35)",
            }}
          >
            Join Room →
          </button>
        </form>
      </div>
    </div>
  );
}
