import { useTheme } from '@/context/theme/useTheme';
import { MetricsHeader } from './MetricsHeader';
import { PrimaryScreen } from './PrimaryScreen';

export function TabLayout() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return <div className={`flex flex-col h-screen w-full select-none overflow-hidden font-sans transition-all duration-200 ${isDark ? 'bg-[#070A0F] text-[#F0F2F8]' : 'bg-slate-50 text-slate-900'
        }`}>

        {/* 1. Header component */}
        <MetricsHeader />
        <PrimaryScreen />
    </div>
}