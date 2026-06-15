import Avatar from "./Avatar";
import { getAvatarColor, getInitials } from "../utils/chatUtils";

// Ensure 'export' is here and the name is 'OnlineUserRow'
export default function OnlineUserRow({ name, isMe, active, onClick }) {
    const color = getAvatarColor(name);
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-full w-full text-left transition-all duration-150 border ${active
                ? "bg-white/55 border-slate-200/60"
                : "bg-white/15 border-slate-200/30 hover:bg-white/35"
                }`}
        >
            <div className="relative">
                <Avatar initials={getInitials(name)} gradFrom={color.gradFrom} gradTo={color.gradTo} textColor={color.textColor} size="sm" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white" style={{ background: "#34D399" }} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 tracking-tight truncate">
                    {isMe ? `${name} (you)` : name}
                </p>
                <p className="text-[11px] text-slate-400">Active now</p>
            </div>
        </button>
    );
}
