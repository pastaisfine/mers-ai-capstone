import { useEffect, useState, type ReactNode } from 'react';
import { TimeContext } from './useTime';

export function TimeProvider({ children }: { children: ReactNode }) {
    const [currentTimeText, setCurrentTimeText] = useState('14:22:08');
    useEffect(() => {
        const timer = setTimeout(() => {
            const d = new Date();
            setCurrentTimeText(d.toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return <TimeContext value={{ currentTimeText }}>{children}</TimeContext>
}

