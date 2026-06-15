export default function Avatar({ initials, gradFrom, gradTo, textColor, size = "md" }) {
    const sizes = { sm: "w-9 h-9 text-xs", md: "w-11 h-11 text-sm", lg: "w-12 h-12 text-base" };
    return (
        <div
            className={`${sizes[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
            style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, color: textColor }}
        >
            {initials}
        </div>
    );
}