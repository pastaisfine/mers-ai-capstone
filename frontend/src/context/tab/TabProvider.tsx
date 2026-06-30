import { TabName } from '@/types';
import { useState, type ReactNode } from 'react';
import { TabContext } from './useTab';

export function TabProvider({ children, defaultTab }: { children: ReactNode, defaultTab: TabName }) {
    const [currentTab, setCurrentTab] = useState<TabName>(defaultTab);
    return <TabContext value={{ currentTab, setCurrentTab }}>{children}</TabContext>
}

