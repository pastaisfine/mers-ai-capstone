import { useTab } from '@/context/tab/useTab';
import { useTheme } from '@/context/theme/useTheme';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { ActiveIncidentsList } from './ActiveIncidentsList';
import { TacticalWorkspace } from './TacticalWorkspace';
import { LiveIntelligencePanel } from './LiveIntelligencePanel';
import { ScenarioSimulator } from './ScenarioSimulator';
import { ReportProvider } from '@/context/report/ReportProvider';
import { ReportsTab } from './ReportsTab';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export function PrimaryScreen() {
    const { currentTab } = useTab();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return <main className="flex-1 flex overflow-hidden">

        {/* OP-DESK TAB SCREEN */}
        {currentTab === 'dashboard' && (
            <ResizablePanelGroup orientation="horizontal" className="flex-1 w-full overflow-hidden">
                <ResizablePanel defaultSize={70} className="flex flex-col lg:flex-row h-full">
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
                </ResizablePanel>

                <ResizableHandle withHandle className={isDark ? "bg-[#2D334A]" : "bg-slate-200"} />

                {/* Live speech transcription and diagnostic panels */}
                <ResizablePanel defaultSize={30}>
                    <LiveIntelligencePanel
                        theme={theme}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        )}

        {/* SIMULATOR SCREEN TAB */}
        {currentTab === 'simulation' && (
            <ScenarioSimulator />
        )}

        {currentTab === 'reports' && <ReportProvider><ReportsTab theme={theme} /></ReportProvider>}

    </main>
}