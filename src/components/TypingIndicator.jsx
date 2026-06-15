import Avatar from "./Avatar";
import { getAvatarColor, getInitials } from "../utils/chatUtils";

export default function TypingIndicator({ username }) {
    const color = getAvatarColor(username);
    return (
        <div className="flex items-end gap-2 sm:gap-3 mb-4" style={{ animation: "fadeUp 0.2s ease both" }}>
            <div className="mt-1 hidden sm:block">
                <Avatar initials={getInitials(username)} gradFrom={color.gradFrom} gradTo={color.gradTo} textColor={color.textColor} size="sm" />
            </div>
            <div className="flex flex-col gap-1 items-start">
                <span className="text-xs font-bold text-purple-500">{username}</span>
                <div
                    className="flex items-center gap-1 px-4 py-3 rounded-3xl rounded-tl-none border border-slate-100"
                    style={{ background: "rgba(255,255,255,0.82)" }}
                >
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                </div>
            </div>
        </div>
    );
}
