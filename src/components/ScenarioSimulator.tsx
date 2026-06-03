'use client';

/**
 * Simulation tab: scenario form, run controls, and live simulation log feed.
 * See src/components/guides/ScenarioSimulator.md
 */

export interface ScenarioSimulatorProps {
  theme: 'dark' | 'light';
  simScenarioName: string;
  setSimScenarioName: (val: string) => void;
  simIncidentType: 'medical' | 'fire' | 'crime' | 'accident' | 'flood';
  setSimIncidentType: (
    type: 'medical' | 'fire' | 'crime' | 'accident' | 'flood',
  ) => void;
  simPersona: string;
  setSimPersona: (val: string) => void;
  simLanguage: string;
  setSimLanguage: (val: string) => void;
  simLocation: string;
  setSimLocation: (val: string) => void;
  simMultiCallers: boolean;
  setSimMultiCallers: (val: boolean) => void;
  simCallerCount: number;
  setSimCallerCount: (val: number) => void;
  simInjectComplication: boolean;
  setSimInjectComplication: (val: boolean) => void;
  onInitiateSimulation: () => void;
  isSimulating: boolean;
  simLogFeed: string[];
}

export function ScenarioSimulator(_props: ScenarioSimulatorProps) {
  return <section data-component="ScenarioSimulator" />;
}
