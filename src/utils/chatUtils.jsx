export const AVATAR_COLORS = [
    { gradFrom: "#E0D4FF", gradTo: "#C8BFFF", textColor: "#4a2d99" },
    { gradFrom: "#D4F0FF", gradTo: "#BFE8FF", textColor: "#2d4d99" },
    { gradFrom: "#FFE0F0", gradTo: "#FFD4E8", textColor: "#99284d" },
    { gradFrom: "#D4FFE8", gradTo: "#BFF0D4", textColor: "#1a7a4a" },
    { gradFrom: "#FFF0D4", gradTo: "#FFE8BF", textColor: "#7a4a1a" },
];

const colorCache = {};
export function getAvatarColor(name = "") {
    if (!colorCache[name]) {
        const idx = Object.keys(colorCache).length % AVATAR_COLORS.length;
        colorCache[name] = AVATAR_COLORS[idx];
    }
    return colorCache[name];
}

export const getInitials = (name = "") => name.slice(0, 2).toUpperCase();

export const getTime = (iso) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};