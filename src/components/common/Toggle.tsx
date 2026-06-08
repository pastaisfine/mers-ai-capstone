import { useTheme } from '@/context/theme/useTheme';
import { useMemo } from 'react';

function Toggle({ text, active, onClick, activeBackgroundColor = 'bg-[#E63946]' }: { text: string, active: boolean, onClick: () => void, activeBackgroundColor?: string }) {
    const { theme } = useTheme();

    const buttonVariantClass = useMemo(() => {
        if (active) return `${activeBackgroundColor} text-white shadow-sm `
        switch (theme) {
            case 'dark':
                return 'bg-[#151824] text-slate-400 hover:text-white';
            case 'light':
            default:
                return 'bg-slate-100 text-slate-500 hover:bg-slate-200';
        }
    }, [theme, active]);
    return <button className={`${buttonVariantClass} flex-1 rounded-md  px-4 py-1.5 flex justify-center items-center transition-all cursor-pointer`} onClick={onClick}>
        <span className='text-[10px] font-black'>{text}</span>
    </button>;
}

export default Toggle;