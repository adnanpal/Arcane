const NAV_LINKS = [
    {
        id: "public", label: "Public",
        icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" /></svg>,
    },
    {
        id: "private", label: "Private",
        icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-3.1-9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9z" /></svg>,
    },
    {
        id: "requests", label: "Requests",
        icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>,
    },
    {
        id: "settings", label: "Settings",
        icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.06 7.06 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 4h-3.84c-.24 0-.43.17-.47.41l-.36 2.54a7.22 7.22 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>,
    },
];
export default function NavLink({ link, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full w-full text-left text-sm font-medium transition-all duration-200 ${active
                ? "bg-white/55 border border-gray-300/50 text-indigo-400 font-bold"
                : "text-slate-400 hover:bg-purple-100/50 hover:text-slate-600"
                }`}
        >
            <span className={active ? "text-indigo-400" : "text-slate-400"}>{link.icon}</span>
            {link.label}
        </button>
    );
}