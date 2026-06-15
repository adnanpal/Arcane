import Avatar from "./Avatar";
import { getAvatarColor, getInitials, getTime } from "../utils/chatUtils";

export default function MessageBubble({ msg, currentUser }) {
    if (msg.type === "system") {
        return (
            <div className="flex justify-center my-3">
                <span
                    className="px-3 py-1 rounded-full text-[11px] text-slate-400 italic"
                    style={{ background: "rgba(0,0,0,0.04)" }}
                >
                    {msg.text}
                </span>
            </div>
        );
    }

    const isSent = msg.username === currentUser;
    const color = getAvatarColor(msg.username);

    return (
        <div
            className={`flex items-end gap-2 sm:gap-3 mb-4 sm:mb-5 ${isSent ? "flex-row-reverse" : ""}`}
            style={{ animation: "fadeUp 0.3s ease both" }}
        >
            <div className="mt-1 hidden sm:block">
                <Avatar
                    initials={getInitials(msg.username)}
                    gradFrom={color.gradFrom}
                    gradTo={color.gradTo}
                    textColor={color.textColor}
                    size="sm"
                />
            </div>

            <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[72%] md:max-w-[62%] ${isSent ? "items-end" : "items-start"}`}>
                <div className={`flex items-center gap-2 ${isSent ? "flex-row-reverse" : ""}`}>
                    <span className={`text-xs font-bold tracking-tight ${isSent ? "text-slate-400" : "text-purple-500"}`}>
                        {isSent ? "You" : msg.username}
                    </span>
                    <span className="text-[10px] text-slate-400 opacity-60">{getTime(msg.timestamp)}</span>
                </div>

                <div
                    className={`px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13px] leading-relaxed shadow-sm ${isSent
                        ? "rounded-3xl rounded-tr-none font-medium text-right"
                        : "rounded-3xl rounded-tl-none border border-slate-100"
                        }`}
                    style={
                        isSent
                            ? { background: "#C4B5FD", color: "#1E1B4B" }
                            : { background: "rgba(255,255,255,0.82)", color: "#4B4A56" }
                    }
                >
                    {msg.text}
                </div>
            </div>
        </div>
    );
}