import { useState, type ReactNode } from 'react';
import { Theme } from '@/types';
import { ThemeContext } from './useTheme';



export function ThemeProvider({ children, defaultTheme }: { children: ReactNode, defaultTheme: Theme }) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    function toggleTheme() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }

    return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
}

