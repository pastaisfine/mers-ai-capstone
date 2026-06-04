'use client';

import { useState, useEffect } from 'react';

import { Incident } from './types';
import { MetricsHeader } from './components/MetricsHeader';
import { ActiveIncidentsList } from './components/ActiveIncidentsList';
import { TacticalWorkspace } from './components/TacticalWorkspace';
import { LiveIntelligencePanel } from './components/LiveIntelligencePanel';
import { TacticalFooter } from './components/TacticalFooter';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ReportsTab } from './components/ReportsTab';

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-0042',
    type: 'medical',
    title: 'Suspected Cardiac Arrest',
    location: 'Jalan Ampang, KL (Near Mamak Pelita)',
    severity: 'CRITICAL',
    priority: 94,
    lang: 'EN / BM',
    caller: 'MR. TAN',
    duration: '03:42',
    distressScore: 87,
    panicLevel: 'Extreme',
    entities: ['👤 Adult Male (62yo)', '📍 Jalan Ampang', '🩺 Cardiac Arrest'],
    reason: 'Cardiac arrest keywords detected. Caller panic level extreme. Immediate medical intervention required.',
    confidence: 91,
    contradiction: 'CONTRADICTION DETECTED — Caller stated subject was \'breathing fine\' at 3:02PM, then \'tidak sedar diri\' at 3:04PM. Severity escalated automatically.',
    sopCitation: 'WHO CPR Guidelines 2023 — Section 3.2 | Relevance: 94%',
    sopProcedure: [
      'Instruct caller to place phone on speaker next to patient.',
      'Guide chest compressions immediately (100–120 compressions per minute).',
      'Instruct helper to locate nearest private/public AED if available.'
    ],
    responder: { 
      name: 'Ambulance A1 - EMS Unit', 
      type: 'Emergency Medical Service', 
      distance: '2.4km', 
      eta: '06:45m', 
      status: 'Ready',
      paramedic: 'Rizal K.' 
    },
    timeline: [
      { time: '14:22:00', event: 'Call Connected (Op: Khalid)' },
      { time: '14:22:05', event: 'AI Core Activation & Geo-Trilateration' },
      { time: '14:22:18', event: 'Severity Escalated to CRITICAL' }
    ],
    transcript: [
      { time: '03:00', speaker: 'Caller', text: 'Tolong! Ayah saya jatuh, dia TIDAK SEDAR DIRI!' },
      { time: '03:05', speaker: 'Operator', text: 'Bertenang encik. Di mana lokasi anda?' },
      { time: '03:12', speaker: 'Caller', text: 'Saya di Jalan Ampang, depan kedai mamak. Dia NOT BREATHING. Please hurry!' },
      { time: '03:28', speaker: 'Operator', text: 'Bantuan dalam perjalanan. Adakah mangsa masih bernafas?' }
    ],
    coordinates: { x: 260, y: 140, lat: 3.158, lng: 101.714 },
    status: {}
  },
  {
    id: 'INC-0045',
    type: 'fire',
    title: 'Structure Fire (Residential)',
    location: 'Taman Melawati, KL',
    severity: 'URGENT',
    priority: 72,
    lang: 'BM',
    caller: 'PUAN AMINAH',
    duration: '01:58',
    distressScore: 75,
    panicLevel: 'High',
    entities: ['🔥 Grade A Fire', '📍 Taman Melawati', '🏠 Double-Storey Terrace'],
    reason: 'Active residential structure fire. Dark toxic smoke detected in hallway. Safe evacuation logged.',
    confidence: 88,
    sopCitation: 'Bomba Malaysia Incident Protocol Code 1.1 | Relevance: 96%',
    sopProcedure: [
      'Confirm all occupants have evacuated safety boundaries.',
      'Advise caller to shut principal electrical mains from outside if safe.',
      'Instruct neighbor structures to saturate fence borders to prevent spread.'
    ],
    responder: { 
      name: 'Bomba Melawati - Unit Engine 1', 
      type: 'Fire Suppression & Rescue', 
      distance: '1.8km', 
      eta: '04:30m', 
      status: 'Ready',
      paramedic: 'Zubir A.'
    },
    timeline: [
      { time: '14:10:10', event: 'Call Triggered from Taman Melawati Area' },
      { time: '14:10:30', event: 'Bomba Melawati Base Alert Sent' }
    ],
    transcript: [
      { time: '01:00', speaker: 'Caller', text: 'Tolong! Dapur rumah saya terbakar! Asap dah tebal sangat kat ruang tamu.' },
      { time: '01:15', speaker: 'Operator', text: 'Sila keluar dari rumah segera puan. Adakah semua ahli keluarga sudah keluar?' },
      { time: '01:30', speaker: 'Caller', text: 'Ya, kami semua kat luar sekarang, tapi api makin besar. Takut merebak ke jiran sebelah!' }
    ],
    coordinates: { x: 380, y: 70, lat: 3.210, lng: 101.748 },
    status: {}
  },
  {
    id: 'INC-0046',
    type: 'accident',
    title: 'MVA - Multi-Vehicle Collision',
    location: 'Federal Highway, KM 4.2',
    severity: 'MODERATE',
    priority: 45,
    lang: 'EN',
    caller: 'SARAH JANE',
    duration: '02:15',
    distressScore: 40,
    panicLevel: 'Moderate',
    entities: ['🚗 3 Passenger Cars', '🛣 Express Route Blocked', '📍 Federal Highway Km 4.2'],
    reason: 'Rear-end collision involving 3 vehicles. No passenger casualties reported. Heavy lane obstruction.',
    confidence: 95,
    sopCitation: 'Highway Patrol Incident Standards | Relevance: 90%',
    sopProcedure: [
      'Instruct all drivers to stand behind federal highway guardrails.',
      'Activate vehicle hazard flashers immediately.',
      'Advise local tow services to clear central flow lane.'
    ],
    responder: { 
      name: 'IPD Cheras - Traffic Patrol', 
      type: 'Law Enforcement / Traffic Control', 
      distance: '3.8km', 
      eta: '08:00m', 
      status: 'Ready',
      paramedic: 'Firdaus M.'
    },
    timeline: [
      { time: '14:05:15', event: 'Highway CCTV automated collision flag' },
      { time: '14:05:45', event: 'Sarah Jane call verified' }
    ],
    transcript: [
      { time: '01:20', speaker: 'Caller', text: 'I just got into an accident on the Federal Highway. Three cars bumped into each other.' },
      { time: '01:40', speaker: 'Operator', text: 'Understood. Are you or anyone in the other vehicles injured?' },
      { time: '02:00', speaker: 'Caller', text: 'No, everyone is walking fine, but the cars are blocking the center lane. It is causing heavy traffic!' }
    ],
    coordinates: { x: 120, y: 220, lat: 3.120, lng: 101.670 },
    status: {}
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'simulation' | 'reports'>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Incidents state
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-0042');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  // Operational shifts audit states
  const [overridesCount, setOverridesCount] = useState(3);
  const [resolvedCount, setResolvedCount] = useState(23);

  // Simulation Parameters
  const [simScenarioName, setSimScenarioName] = useState('Cheras Gas Leak Explosion');
  const [simIncidentType, setSimIncidentType] = useState<'medical' | 'fire' | 'crime' | 'accident' | 'flood'>('fire');
  const [simPersona, setSimPersona] = useState('Panicked Adult');
  const [simLanguage, setSimLanguage] = useState('Mixed (Bahasa / Manglish)');
  const [simLocation, setSimLocation] = useState('Cheras LeisureMall, KL');
  const [simMultiCallers, setSimMultiCallers] = useState(true);
  const [simCallerCount, setSimCallerCount] = useState(2);
  const [simInjectComplication, setSimInjectComplication] = useState(true);

  // Active Simulation running status state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLogFeed, setSimLogFeed] = useState<string[]>([
    'System standby. Ready for instructions.'
  ]);

  // Current selected active state
  const activeIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];

  // Dynamic system atomic clock
  const [currentTimeText, setCurrentTimeText] = useState('14:22:08');
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTimeText(d.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync theme selection with document.documentElement for global custom elements
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Sync simulation interval triggers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimStep(prevStep => {
          const nextStep = prevStep + 1;
          
          if (nextStep === 1) {
            setSimLogFeed(prev => [`[${currentTimeText}] Spawning incident vector at lat/long grid targets.`, ...prev]);
            setIncidents(prev => prev.map(inc => {
              if (inc.id === 'SIM-9999') {
                return {
                  ...inc,
                  status: { ...inc.status, location: 'DONE' },
                  timeline: [...inc.timeline, { time: currentTimeText, event: 'Location locked via emergency GPS triangulation.' }]
                };
              }
              return inc;
            }));
          } else if (nextStep === 3) {
            setSimLogFeed(prev => [`[${currentTimeText}] Analyzing speech telemetry: '${simLanguage}' dialect detected.`, ...prev]);
            setIncidents(prev => prev.map(inc => {
              if (inc.id === 'SIM-9999') {
                return {
                  ...inc,
                  status: { ...inc.status, transcription: 'DONE' },
                  timeline: [...inc.timeline, { time: currentTimeText, event: 'Transcription pipeline fully calibrated.' }]
                };
              }
              return inc;
            }));
          } else if (nextStep === 5) {
            setSimLogFeed(prev => [`[${currentTimeText}] Semantic evaluation executed. Priority score mapped to 89.`, ...prev]);
            setIncidents(prev => prev.map(inc => {
              if (inc.id === 'SIM-9999') {
                return {
                  ...inc,
                  status: { ...inc.status, triage: 'DONE', sop: 'DONE' },
                  severity: 'CRITICAL',
                  priority: 89,
                  timeline: [
                    ...inc.timeline,
                    { time: currentTimeText, event: 'Triage diagnostic evaluated as CRITICAL.' },
                    { time: currentTimeText, event: 'Malaysia National Fire SOP Standard Code 4.2 retrieved.' }
                  ]
                };
              }
              return inc;
            }));
          } else if (nextStep === 7 && simInjectComplication) {
            setSimLogFeed(prev => [`[${currentTimeText}] Flagging contradiction in verbal claim timeline. Escalating risks.`, ...prev]);
            setIncidents(prev => prev.map(inc => {
              if (inc.id === 'SIM-9999') {
                return {
                  ...inc,
                  contradiction: '⚠ CONTRADICTION DETECTED — Caller initially reported \'no casualties\', but subsequent sentence mentions \'trapped shopkeepers inside kitchen\'. AI upgraded urgency profile.'
                };
              }
              return inc;
            }));
          } else if (nextStep >= 10) {
            setSimLogFeed(prev => [`[${currentTimeText}] Scenario simulation complete. Dispatch suggestions finalized.`, ...prev]);
            setIsSimulating(false);
            clearInterval(interval);
          }

          return nextStep;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simLanguage, simInjectComplication, currentTimeText]);

  // Launch a new simulated incident
  const handleRunSimulation = () => {
    const newSimIncident: Incident = {
      id: 'SIM-9999',
      type: simIncidentType,
      title: simScenarioName || 'Simulated Emergency Service Request',
      location: simLocation || 'Pusat Bandar Kuala Lumpur',
      severity: 'URGENT',
      priority: 65,
      lang: simLanguage.toUpperCase(),
      caller: simPersona.toUpperCase(),
      duration: '00:00',
      distressScore: 82,
      panicLevel: simPersona.includes('Panicked') ? 'High' : 'Moderate',
      entities: [
        simIncidentType === 'fire' ? '🔥 Active Fire Zone' : '🚑 Critical Vital Distress',
        `📍 ${simLocation || 'Klang Valley'}`,
        '👤 Live Scenario Stream'
      ],
      reason: `Simulation engine generated scenario for ${simIncidentType} involving a ${simPersona} in ${simLanguage}.`,
      confidence: 93,
      sopCitation: simIncidentType === 'fire' 
        ? 'Bomba Malaysia Incident Protocol Code 2.4 | Relevance: 95%'
        : 'SOP Malaysia First-Responder Standards | Relevance: 91%',
      sopProcedure: simIncidentType === 'fire' ? [
        'Command deployment of nearest high-pressure water engines.',
        'Inform electrical transmission grids to cut high power mains.',
        'Saturate structural outer brickwork with water barrier curtain.'
      ] : [
        'Direct caller to administer primary physical stability checks.',
        'Verify immediate airway clearance parameters.',
        'Keep patient warm and elevate extremities if fully conscious.'
      ],
      responder: simIncidentType === 'fire' 
        ? { name: 'Bomba Cheras - Unit Engine 2', type: 'Fire Suppression & Rescue', distance: '2.5km', eta: '05:40m', status: 'Ready', paramedic: 'Amin' }
        : { name: 'Ambulance Pantai - Medic 3', type: 'Emergency Medical Service', distance: '3.1km', eta: '07:15m', status: 'Ready', paramedic: 'Rizal K.' },
      timeline: [
        { time: currentTimeText, event: 'Simulated dispatch line hooked.' }
      ],
      transcript: simIncidentType === 'fire' ? [
        { time: '00:01', speaker: 'Caller', text: 'TOLONG! Ada asap hitam keluar dari bumbung kedai belakang leisure mall!' },
        { time: '00:05', speaker: 'Operator', text: 'Sila keluar ke kawasan terbuka. Adakah terdapat mangsa terperangkap di dalam?' },
        { time: '00:09', speaker: 'Caller', text: 'Saya rasa semua dah keluar... sekejap, tak! Kawan saya kata ada dua orang masih kat dapur belakang!' },
        { time: '00:13', speaker: 'Operator', text: 'Faham. Unit Bomba Cheras sedang bertindak pantas. Bertenang di lokasi selamat.' }
      ] : [
        { time: '00:01', speaker: 'Caller', text: 'Please help, my grandmother slipped in the bathroom and cannot get back up!' },
        { time: '00:05', speaker: 'Operator', text: 'Keep calm maam. Is she breathing and responsive right now?' },
        { time: '00:09', speaker: 'Caller', text: 'Yes she is talking but in extreme hip pain. She says she feels very dizzy.' },
        { time: '00:13', speaker: 'Operator', text: 'Understood. Dispatching paramedic unit to your exact coordinates now.' }
      ],
      coordinates: { x: 320, y: 220, lat: 3.091, lng: 101.741 },
      status: {}
    };

    setIncidents(prev => {
      const filtered = prev.filter(inc => inc.id !== 'SIM-9999');
      return [newSimIncident, ...filtered];
    });
    setSelectedIncidentId('SIM-9999');
    setSimStep(0);
    setSimLogFeed([
      `[${currentTimeText}] Simulation thread INITIALIZED.`,
      `[${currentTimeText}] Host: OP-KHALID | Target: ${simLocation}`,
      `[${currentTimeText}] Injecting complication vector: ${simInjectComplication ? 'Enabled' : 'Disabled'}`
    ]);
    setIsSimulating(true);
    setCurrentTab('dashboard');
  };

  // Dispatch trigger handler
  const handleDispatchAction = (id: string, unitName: string) => {
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
  const handleOverrideAction = (id: string) => {
    setOverridesCount(prev => prev + 1);
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const nextSeverity = inc.severity === 'CRITICAL' ? 'URGENT' : 'CRITICAL';
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

  // Close Incident Event
  const handleCloseIncidentAction = () => {
    const id = activeIncident.id;
    setResolvedCount(prev => prev + 1);
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          severity: 'RESOLVED',
          timeline: [...inc.timeline, { time: currentTimeText, event: `Incident officially CLOSED by operator.` }]
        };
      }
      return inc;
    }));
    setSimLogFeed(prev => [`[${currentTimeText}] Incident ${id} marked as RESOLVED and archived.`, ...prev]);
  };

  // Ignore incident
  const handleIgnoreAction = () => {
    setSimLogFeed(prev => [`[${currentTimeText}] Incident ${activeIncident.id} ignore flag marked in session logs.`, ...prev]);
  };

  // Escalate case
  const handleEscalateAction = () => {
    setSimLogFeed(prev => [`[${currentTimeText}] Crisis level ESCALATION applied on ${activeIncident.id}. Notification forwarded to Supervisor.`, ...prev]);
  };

  // Filter queue computed variables
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Pulse voice waveform generator heights
  const [waveformHeights, setWaveformHeights] = useState<number[]>([12, 24, 8, 16, 32, 10, 4, 18, 22, 14, 28, 6, 12, 20]);
  useEffect(() => {
    if (activeIncident.severity === 'CRITICAL' || isSimulating) {
      const pulseInterval = setInterval(() => {
        setWaveformHeights(prev => prev.map(() => Math.floor(Math.random() * 26) + 4));
      }, 150);
      return () => clearInterval(pulseInterval);
    }
  }, [activeIncident, isSimulating]);

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen w-full select-none overflow-hidden font-sans transition-all duration-200 ${
      isDark ? 'bg-[#070A0F] text-[#F0F2F8]' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. Header component */}
      <MetricsHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        setTheme={setTheme}
        activeCount={incidents.filter(i => i.severity !== 'RESOLVED').length}
        criticalCount={incidents.filter(i => i.severity === 'CRITICAL').length}
        resolvedCount={resolvedCount}
        currentTimeText={currentTimeText}
        isSimulating={isSimulating}
      />

      {/* 2. Primary Screen renders */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* OP-DESK TAB SCREEN */}
        {currentTab === 'dashboard' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Sidebar Active Queue */}
            <ActiveIncidentsList
              incidents={filteredIncidents}
              selectedIncidentId={selectedIncidentId}
              setSelectedIncidentId={setSelectedIncidentId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterSeverity={filterSeverity}
              setFilterSeverity={setFilterSeverity}
              theme={theme}
            />

            {/* Tactical GPS map custom workspace */}
            <TacticalWorkspace
              activeIncident={activeIncident}
              theme={theme}
              currentTimeText={currentTimeText}
            />

            {/* Live speech transcription and diagnostic panels */}
            <LiveIntelligencePanel
              activeIncident={activeIncident}
              theme={theme}
              onDispatch={handleDispatchAction}
              onOverride={handleOverrideAction}
              waveformHeights={waveformHeights}
            />

          </div>
        )}

        {/* SIMULATOR SCREEN TAB */}
        {currentTab === 'simulation' && (
          <ScenarioSimulator
            theme={theme}
            simScenarioName={simScenarioName}
            setSimScenarioName={setSimScenarioName}
            simIncidentType={simIncidentType}
            setSimIncidentType={setSimIncidentType}
            simPersona={simPersona}
            setSimPersona={setSimPersona}
            simLanguage={simLanguage}
            setSimLanguage={setSimLanguage}
            simLocation={simLocation}
            setSimLocation={setSimLocation}
            simMultiCallers={simMultiCallers}
            setSimMultiCallers={setSimMultiCallers}
            simCallerCount={simCallerCount}
            setSimCallerCount={setSimCallerCount}
            simInjectComplication={simInjectComplication}
            setSimInjectComplication={setSimInjectComplication}
            onInitiateSimulation={handleRunSimulation}
            isSimulating={isSimulating}
            simLogFeed={simLogFeed}
          />
        )}

        {currentTab === 'reports' && <ReportsTab theme={theme} />}

      </main>

      {/* 4. Bottom action command footer */}
      {currentTab === 'dashboard' && (
        <TacticalFooter
          theme={theme}
          onIgnore={handleIgnoreAction}
          onCloseIncident={handleCloseIncidentAction}
          onEscalate={handleEscalateAction}
          onAcceptAndDispatch={() => handleDispatchAction(activeIncident.id, activeIncident.responder.name)}
          dispatchStatus={activeIncident.status.dispatch || 'READY'}
        />
      )}

    </div>
  );
}
