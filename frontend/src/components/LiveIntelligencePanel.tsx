import { useEffect, useState } from 'react';
import { Volume2, AlertCircle, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { SeverityType, type Incident } from '../types';
import { useSimulator } from '@/context/simulator/useSimulator';
import { useIncident } from '@/context/incident/useIncident';
import { useTime } from '@/context/time/useTime';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface LiveIntelligencePanelProps {
  theme?: 'light' | 'dark';
}

export function LiveIntelligencePanel({
  theme = 'light',
}: LiveIntelligencePanelProps) {
  const isDark = theme === 'dark';
  const { isSimulating, setSimLogFeed } = useSimulator();
  const { setIncidents, activeIncident } = useIncident();
  const { currentTimeText } = useTime();
  const [activeTab, setActiveTab] = useState<'all' | 'feed' | 'triage' | 'sop'>('all');

  // Pulse voice waveform generator heights
  const [waveformHeights, setWaveformHeights] = useState<number[]>([12, 24, 8, 16, 32, 10, 4, 18, 22, 14, 28, 6, 12, 20]);

  useEffect(() => {
    if (activeIncident?.severity === SeverityType.CRITICAL || isSimulating) {
      const pulseInterval = setInterval(() => {
        setWaveformHeights(prev => prev.map(() => Math.floor(Math.random() * 26) + 4));
      }, 150);
      return () => clearInterval(pulseInterval);
    }
  }, [activeIncident, isSimulating]);

  // Dispatch trigger handler
  const onDispatch = (id: string, unitName: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status: { ...inc.status, dispatch: 'DISPATCHED' },
          responder: { ...inc.responder, status: 'DISPATCHED' },
          timeline: [...inc.timeline, { time: currentTimeText, event: `Unit [${unitName}] dispatched to coordinates.` }]
        };
      }
      return inc;
    }));
    setSimLogFeed(prev => [`[${currentTimeText}] Operator APPROVED dispatch of unit: ${unitName}`, ...prev]);
  };

  // Manual Override Severity
  const onOverride = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const nextSeverity = inc.severity === SeverityType.CRITICAL ? 'URGENT' : 'CRITICAL';
        return {
          ...inc,
          severity: nextSeverity as any,
          timeline: [...inc.timeline, { time: currentTimeText, event: `Operator manual override: Severity set to ${nextSeverity}.` }]
        };
      }
      return inc;
    }));
    setSimLogFeed(prev => [`[${currentTimeText}] Operator manual OVERRIDE registered on ${id}`, ...prev]);
  };

  return (
    <aside className={cn(
      "h-full w-full flex flex-col z-10",
      isDark ? 'bg-[#0B0D12] text-white dark' : 'bg-white text-slate-900'
    )}>
      {/* Header */}
      <div className={cn(
        "flex shrink-0 px-4 py-3 border-b items-center justify-between",
        isDark ? "border-[#2D334A]" : "border-slate-200"
      )}>
        <div className="flex items-center gap-2">
          <Brain className={cn("w-4 h-4", isDark ? "text-red-400" : "text-red-600")} />
          <h2 className={cn("text-[12px] font-bold font-mono tracking-wider", isDark ? "text-gray-400" : "text-slate-500")}>
            LIVE INTELLIGENCE
          </h2>
        </div>
        {isSimulating && (
          <Badge variant="destructive" className="animate-pulse text-[9px] uppercase px-1.5 py-0 h-4">
            Simulating
          </Badge>
        )}
      </div>

      {/* Tabs list */}
      <div className={cn("p-2 border-b shrink-0", isDark ? "border-[#2D334A]" : "border-slate-200")}>
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-0.5 rounded-lg">
            <TabsTrigger value="all" className={cn(
              "text-[10px] font-semibold tracking-wider uppercase py-1 transition-all",
              isDark
                ? "data-[state=active]:bg-red-900 data-[state=active]:text-blue-100"
                : "data-[state=active]:bg-blue-600 data-[state=active]:text-white")}>
              All
            </TabsTrigger>
            <TabsTrigger value="feed" className={cn(
              "text-[10px] font-semibold tracking-wider uppercase py-1 transition-all",
              isDark
                ? "data-[state=active]:bg-red-900 data-[state=active]:text-blue-100"
                : "data-[state=active]:bg-blue-600 data-[state=active]:text-white")}>
              Feed
            </TabsTrigger>
            <TabsTrigger value="triage" className={cn(
              "text-[10px] font-semibold tracking-wider uppercase py-1 transition-all",
              isDark
                ? "data-[state=active]:bg-red-900 data-[state=active]:text-blue-100"
                : "data-[state=active]:bg-blue-600 data-[state=active]:text-white")}>
              Triage
            </TabsTrigger>
            <TabsTrigger value="sop" className={cn(
              "text-[10px] font-semibold tracking-wider uppercase py-1 transition-all",
              isDark
                ? "data-[state=active]:bg-red-900 data-[state=active]:text-blue-100"
                : "data-[state=active]:bg-blue-600 data-[state=active]:text-white")}>
              SOP
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Content Area */}
      <ScrollArea className={cn(
        "flex-1 min-h-0 overflow-hidden relative",
        // Force scrollbar visibility and layout using Tailwind v4 native descendant/state selectors
        "**:data-[slot=scroll-area-scrollbar]:absolute **:data-[slot=scroll-area-scrollbar]:right-1 **:data-[slot=scroll-area-scrollbar]:top-0 **:data-[slot=scroll-area-scrollbar]:bottom-0 **:data-[slot=scroll-area-scrollbar]:w-1.5 **:data-[slot=scroll-area-scrollbar]:flex **:data-[slot=scroll-area-scrollbar]:bg-transparent",
        "**:data-[slot=scroll-area-thumb]:relative **:data-[slot=scroll-area-thumb]:flex-1 **:data-[slot=scroll-area-thumb]:rounded-full **:data-[slot=scroll-area-thumb]:bg-slate-300/60 dark:**:data-[slot=scroll-area-thumb]:bg-slate-700/60 hover:**:data-[slot=scroll-area-thumb]:bg-slate-400 dark:hover:**:data-[slot=scroll-area-thumb]:bg-slate-600 **:data-[slot=scroll-area-thumb]:transition-colors"
      )}>
        <div className="flex flex-col gap-4 p-4 pb-6">
          {/* Transcript Section (Feed) */}
          {(activeTab === 'feed' || activeTab === 'all') && (
            <div className={cn(
              "flex flex-col p-4 rounded-xl border transition-all duration-200 shadow-sm",
              isDark ? "bg-[#161922] border-[#2D334A]" : "bg-slate-50 border-slate-200"
            )}>
              <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-200/50 dark:border-[#2D334A]/50">
                <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-mono">
                  Real-time Transcript
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Active Connection
                </span>
              </div>

              <div className="font-mono text-xs flex flex-col gap-3 leading-relaxed max-h-[240px] overflow-y-auto pr-1">
                {activeIncident?.transcript.length === 0 ? (
                  <div className="text-muted-foreground text-center py-4 text-xs italic">No transcript logs yet...</div>
                ) : (
                  activeIncident?.transcript.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-muted-foreground w-11 shrink-0 select-none text-[10px]">{line.time}</span>
                      <div className="flex-1">
                        <span className={cn(
                          "font-bold pr-1.5",
                          line.speaker === 'Caller' ? 'text-red-500' : 'text-blue-500 dark:text-blue-400'
                        )}>
                          {line.speaker}:
                        </span>
                        <span className={isDark ? "text-slate-200" : "text-slate-800"}>
                          {line.text}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={cn(
                "flex items-center justify-between gap-4 shrink-0 mt-4 pt-3 border-t",
                isDark ? "border-[#2D334A]/50" : "border-slate-200/50"
              )}>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] font-mono shrink-0">
                    CH: 104.5
                  </span>
                </div>
                <div className="flex items-end gap-[2px] h-6 flex-1 max-w-[150px]">
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-red-500/80 rounded-xs transition-all duration-150"
                      style={{ height: `${(h / 32) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Triage Section */}
          {(activeTab === 'triage' || activeTab === 'all') && (
            <div className={cn(
              "flex flex-col p-4 gap-4 rounded-xl border transition-all duration-200 shadow-sm",
              isDark ? "bg-[#161922] border-[#2D334A]" : "bg-slate-50 border-slate-200"
            )}>
              <div className="flex items-center justify-between mb-1 border-b pb-2 border-slate-200/50 dark:border-[#2D334A]/50">
                <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-mono">
                  AI Cognitive Triage
                </span>
                <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-500 bg-red-500/5 uppercase font-mono px-1.5 py-0 h-4">
                  CONFIRMED
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center shrink-0 border rounded-lg",
                  isDark ? "bg-[#2D334A]/30 border-[#2D334A]" : "bg-red-50 text-red-950 border-red-200"
                )}>
                  <Brain className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">AI Confidence</span>
                    <span className="text-xl font-extrabold tracking-tight text-red-500">
                      {activeIncident?.confidence ?? 0}%
                    </span>
                  </div>
                  <Progress value={activeIncident?.confidence ?? 0} className="h-1.5 **:data-[slot=progress-indicator]:bg-red-500" />
                </div>
              </div>

              <div className="space-y-3">
                <p className={cn("text-xs leading-relaxed font-mono p-2.5 rounded-lg border",
                  isDark ? "bg-black/20 border-slate-800 text-slate-300" : "bg-white border-slate-100 text-slate-600"
                )}>
                  {activeIncident?.reason}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className={cn("p-2 rounded-lg border text-center", isDark ? "bg-black/20 border-slate-800" : "bg-white border-slate-100")}>
                    <div className="text-[9px] font-bold uppercase text-muted-foreground font-mono mb-0.5">Distress Score</div>
                    <div className="text-base font-extrabold text-red-500">{activeIncident?.distressScore}</div>
                  </div>
                  <div className={cn("p-2 rounded-lg border text-center", isDark ? "bg-black/20 border-slate-800" : "bg-white border-slate-100")}>
                    <div className="text-[9px] font-bold uppercase text-muted-foreground font-mono mb-0.5">Panic Level</div>
                    <div className="text-base font-extrabold text-red-500">{activeIncident?.panicLevel}</div>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground font-mono mb-1.5">Extracted Entities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeIncident?.entities.map((e) => (
                      <Badge key={e} variant="secondary" className="text-[9px] font-mono px-2 py-0.5 rounded-md">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>

                {activeIncident?.contradiction && (
                  <Alert variant="destructive" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle className="font-mono text-[10px] font-bold uppercase tracking-wider">Contradiction Warning</AlertTitle>
                    <AlertDescription className="font-mono text-[10px] leading-snug mt-0.5">
                      {activeIncident?.contradiction}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* SOP Section */}
          {(activeTab === 'sop' || activeTab === 'all') && (
            <div className={cn(
              "flex flex-col p-4 gap-4 rounded-xl border transition-all duration-200 shadow-sm",
              isDark ? "bg-[#161922] border-[#2D334A]" : "bg-slate-50 border-slate-200"
            )}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-200/50 dark:border-[#2D334A]/50">
                <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-mono">
                  SOP PROTOCOL
                </span>
                <Badge variant="outline" className="text-[9px] border-blue-500/30 text-blue-500 bg-blue-500/5 font-mono px-1.5 py-0 h-4">
                  {activeIncident?.sopCitation}
                </Badge>
              </div>
              <ol className="space-y-2">
                {activeIncident?.sopProcedure.map((step, i) => (
                  <li key={i} className={cn(
                    "flex items-start gap-2.5 text-xs p-2 rounded-lg border",
                    isDark ? "bg-black/10 border-slate-800/50 text-slate-300" : "bg-white border-slate-100 text-slate-700"
                  )}>
                    <span className="text-[10px] w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold font-mono">
                      {i + 1}
                    </span>
                    <span className="leading-normal flex-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer: Responder + Actions */}
      <div className={cn(
        "p-4 border-t shrink-0 flex flex-col gap-3 mt-auto",
        isDark ? "border-[#2D334A] bg-[#10131B]" : "border-slate-200 bg-slate-50"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-xs uppercase tracking-wider">{activeIncident?.responder?.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {activeIncident?.responder?.type} • ETA: {activeIncident?.responder?.eta}
            </div>
          </div>
          {activeIncident?.status?.dispatch === 'DISPATCHED' && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-mono text-[9px] uppercase">
              Dispatched
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onDispatch(activeIncident?.id, activeIncident?.responder.name)}
            className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-[10px] uppercase tracking-wider h-9"
          >
            Dispatch {activeIncident?.responder.name}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOverride(activeIncident?.id)}
            className="flex-1 font-bold text-[10px] uppercase tracking-wider border-red-500/40 text-red-500 hover:bg-red-500/10 h-9"
          >
            Override
          </Button>
        </div>
      </div>
    </aside>
  );
}
