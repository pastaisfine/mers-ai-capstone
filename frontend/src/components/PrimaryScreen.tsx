import { useTab } from '@/context/tab/useTab';
import { useTheme } from '@/context/theme/useTheme';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { ActiveIncidentsList } from './ActiveIncidentsList';
import { TacticalWorkspace } from './TacticalWorkspace';
import { LiveIntelligencePanel } from './LiveIntelligencePanel';
import { ScenarioSimulator } from './ScenarioSimulator';
import { ReportProvider } from '@/context/report/ReportProvider';
import { ReportsTab } from './ReportsTab';

export function PrimaryScreen() {
    const { currentTab } = useTab();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return <main className="flex-1 flex overflow-hidden">

        {/* OP-DESK TAB SCREEN */}
        {currentTab === 'dashboard' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* Sidebar Active Queue */}
                <CollapsibleSidebar isDark={isDark}>
                    <ActiveIncidentsList
                        theme={theme}
                    />
                </CollapsibleSidebar>

                {/* Tactical GPS map custom workspace */}
                <TacticalWorkspace
                    theme={theme}
                />

                {/* Live speech transcription and diagnostic panels */}
                <LiveIntelligencePanel
                    theme={theme}
                />

            </div>
        )}

        {/* SIMULATOR SCREEN TAB */}
        {currentTab === 'simulation' && (
            <ScenarioSimulator />
        )}

        {currentTab === 'reports' && <ReportProvider><ReportsTab theme={theme} /></ReportProvider>}

    </main>
}