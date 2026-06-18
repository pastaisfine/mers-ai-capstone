'use client';

import { useIncident } from '@/context/incident/useIncident';
import { useSimulator } from '@/context/simulator/useSimulator';
import { useTab } from '@/context/tab/useTab';
import { useTheme } from '@/context/theme/useTheme';
import { useTime } from '@/context/time/useTime';
import { Incident, SeverityType, TabName } from '@/types';
import { useEffect, useState } from 'react';

/**
 * Simulation tab: scenario form, run controls, and live simulation log feed.
 * See src/components/guides/ScenarioSimulator.md
 */

export interface ScenarioSimulatorProps {

}

export function ScenarioSimulator(_props: ScenarioSimulatorProps) {
  const { theme } = useTheme();
  const { setCurrentTab } = useTab();

  const { isSimulating, setSimLogFeed, setIsSimulating } = useSimulator();
  const { setSelectedIncidentId, setIncidents } = useIncident();
  const { currentTimeText } = useTime();
  // Simulation Parameters
  const [simMultiCallers, setSimMultiCallers] = useState(true);
  const [simCallerCount, setSimCallerCount] = useState(2);
  const [simIncidentType, setSimIncidentType] = useState<'medical' | 'fire' | 'crime' | 'accident' | 'flood'>('fire');
  const [simScenarioName, setSimScenarioName] = useState('Cheras Gas Leak Explosion');
  const [simPersona, setSimPersona] = useState('Panicked Adult');
  // Active Simulation running status state
  const [simStep, setSimStep] = useState(0);
  const [simLanguage, setSimLanguage] = useState('Mixed (Bahasa / Manglish)');
  const [simInjectComplication, setSimInjectComplication] = useState(true);
  const [simLocation, setSimLocation] = useState('Cheras LeisureMall, KL');




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
                  severity: SeverityType.CRITICAL,
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
  const onInitiateSimulation = () => {
    const newSimIncident: Incident = {
      id: 'SIM-9999',
      type: simIncidentType,
      title: simScenarioName || 'Simulated Emergency Service Request',
      location: simLocation || 'Pusat Bandar Kuala Lumpur',
      severity: SeverityType.URGENT,
      priority: 65,
      lang: simLanguage.toUpperCase(),
      occurDateTime: "2026-06-12T06:58:14.000Z",
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
    setCurrentTab(TabName.DASHBOARD);
  };

  return <section data-component="ScenarioSimulator" />;
}
