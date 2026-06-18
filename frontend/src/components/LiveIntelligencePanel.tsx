import { useEffect, useState } from 'react';
import { Volume2, AlertCircle, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { SeverityType, type Incident } from '../types';
import { useSimulator } from '@/context/simulator/useSimulator';
import { useIncident } from '@/context/incident/useIncident';
import { useTime } from '@/context/time/useTime';

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
    if (activeIncident.severity === SeverityType.CRITICAL || isSimulating) {
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
      "w-full lg:w-[380px] flex flex-col border-l shrink-0 h-[calc(100vh-64px)] z-10",
      isDark ? 'bg-[#0B0D12] border-[#2D334A] text-white' : 'bg-white border-black text-black'
    )}>
      <div className="flex shrink-0 px-2 py-3 border-b border-black/10">
        <h2 className="text-[14px] font-bold text-gray-400 font-mono">LIVE INTELLIGENCE</h2>
      </div>
      {/* Header Labels */}
      <div className="flex shrink-0 px-2">
        {([
          { label: 'All', id: 'all' },
          { label: 'Live Feed', id: 'feed' },
          { label: 'Triage', id: 'triage' },
          { label: 'SOP', id: 'sop' }
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2 text-[9px] font-bold uppercase tracking-widest text-center border rounded-full mx-1 my-3 cursor-pointer transition-all duration-150",
                isActive
                  ? (isDark ? "bg-white text-black border-red-400" : "bg-red-200 text-black-800 border-red-400")
                  : (isDark ? "bg-transparent border-slate-700 text-gray-400 hover:text-white" : "bg-transparent border-gray-300 text-gray-600 hover:text-black")
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Transcript Section */}
        {(activeTab === 'feed' || activeTab === 'all') && (
          <div className="flex flex-col p-6 bg-gray-100 m-5 rounded-md">
            <div className="flex-1 font-mono text-xs flex flex-col gap-5 leading-relaxed">
              {activeIncident.transcript.map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-gray-500 w-12 shrink-0">{line.time}</span>
                  <div className="flex-1">
                    <span className={cn(
                      "font-bold pr-2",
                      line.speaker === 'Caller' ? 'text-[#E63946]' : 'text-blue-600'
                    )}>
                      {line.speaker}:
                    </span>
                    <span className={isDark ? "text-gray-300" : "text-gray-00"}>
                      {line.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={cn(
              "flex items-center justify-between gap-4 shrink-0 mt-6 pt-4 border-t",
              isDark ? "border-[#2D334A]" : "border-black/10"
            )}>
              <div className="flex items-center gap-2">
                <Volume2 className={cn("w-4 h-4 shrink-0", isDark ? "text-gray-400" : "text-gray-500")} />
                <span className={cn("text-[11px] font-mono shrink-0", isDark ? "text-gray-400" : "text-gray-500")}>
                  CH: 104.5
                </span>
              </div>
              <div className="flex items-end gap-[3px] h-8 flex-1 ml-4">
                {waveformHeights.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#E63946] rounded-sm transition-all duration-150"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Triage Section */}
        {(activeTab === 'triage' || activeTab === 'all') && (
          <div className={cn(
            "flex flex-col p-6 gap-6",
            activeTab === 'all' && (isDark ? "border-t border-[#2D334A]" : "border-t border-black/10")
          )}>
            <div className="flex items-start gap-5 mb-2">
              <div className={cn(
                "w-16 h-16 flex items-center justify-center shrink-0 border",
                isDark ? "bg-[#2D334A] border-transparent" : "bg-red-100 text-red-900 border-red-400 rounded-full"
              )}>
                <Brain className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-bold leading-none tracking-tighter text-red-900">
                    {activeIncident.confidence}%
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 border rounded-full",
                    isDark ? "border-gray-500" : "border-red-400 text-red-400"
                  )}>
                    CONFIRMED
                  </span>
                </div>
                <div className="w-full bg-gray-200">
                  <div className="bg-red-700 h-1.5" style={{ width: `${activeIncident.confidence}%` }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className={cn("text-xs leading-relaxed font-mono", isDark ? "text-gray-400" : "text-gray-600")}>
                {activeIncident.reason}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Distress Score</div>
                  <div className="text-lg font-bold">{activeIncident.distressScore}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Panic Level</div>
                  <div className="text-lg font-bold">{activeIncident.panicLevel}</div>
                </div>
              </div>

              <div className="pt-4">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">Extracted Entities</div>
                <div className="flex flex-wrap gap-2">
                  {activeIncident.entities.map((e) => (
                    <span key={e} className={cn(
                      "text-[10px] px-2 py-0.5 font-bold border",
                      isDark ? "border-gray-700 bg-gray-800 rounded-full" : "border-black bg-white rounded-full"
                    )}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {activeIncident.contradiction && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500 text-xs flex gap-3 font-mono text-amber-700 rounded-md">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{activeIncident.contradiction}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOP Section */}
        {(activeTab === 'sop' || activeTab === 'all') && (
          <div className={cn(
            "flex flex-col p-6 gap-6 bg-gray-100 m-4 rounded-md",
            activeTab === 'all' && (isDark ? "border-t border-[#2D334A]" : "border-t border-black/10")
          )}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest">{activeIncident.sopCitation}</h3>
            </div>
            <ol className="list-none space-y-4">
              {activeIncident.sopProcedure.map((step, i) => (
                <li key={i} className="flex items-start gap-4 text-xs">
                  <span className={cn(
                    "text-[10px] w-5 h-5 flex items-center justify-center shrink-0 font-mono"
                  )}>
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Footer: Responder + Actions */}
      <div className={cn(
        "p-6 border-t shrink-0 flex flex-col gap-4 mt-auto",
        isDark ? "border-[#2D334A] bg-[#1A1D27]" : "border-black bg-gray-100"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-sm uppercase">{activeIncident.responder?.name}</div>
            <div className="text-xs text-gray-500 font-mono mt-1">{activeIncident.responder?.type} • ETA: {activeIncident.responder?.eta}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onDispatch(activeIncident.id, activeIncident.responder.name)}
            className="flex-1 bg-red-700 hover:bg-red-800 rounded-md cursor-pointer text-white p-3 font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Dispatch {activeIncident.responder.name}
          </button>
          <button
            type="button"
            onClick={() => onOverride(activeIncident.id)}
            className={cn(
              "flex-1 border py-3 font-bold text-[10px] uppercase tracking-widest transition-colors",
              isDark ? "border-red-600 hover:bg-red-800 cursor-pointer rounded-md" : "border-red-600 bg-red-300 hover:bg-gray-200 cursor-pointer rounded-md"
            )}
          >
            Override
          </button>
        </div>
      </div>
    </aside>
  );
}
