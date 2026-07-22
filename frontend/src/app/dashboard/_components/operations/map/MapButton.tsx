interface MapButtonProps {
    onClick: () => void;
    isDark: boolean;
    title: string;
    children: React.ReactNode;
}

export function MapButton({ onClick, isDark, title, children }: MapButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer ${isDark
                ? 'bg-black/60 text-slate-300 border border-[#2D334A] hover:bg-black/80 hover:text-white'
                : 'bg-white/80 text-slate-700 border border-slate-300 hover:bg-white'
                }`}
        >
            {children}
        </button>
    );
}