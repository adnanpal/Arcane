export default function IconButton({ children, title, onClick }) {
    return (
        <button
            title={title}
            onClick={onClick}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-black/5 transition-colors flex-shrink-0"
        >
            {children}
        </button>
    );
}