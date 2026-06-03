'use client';

import type { Incident } from '../types';

/**
 * Right panel: live transcript, AI triage, SOP steps, responder dispatch controls.
 * See src/components/guides/LiveIntelligencePanel.md
 */

export interface LiveIntelligencePanelProps {
  activeIncident: Incident;
  theme: 'dark' | 'light';
  onDispatch: (id: string, unitName: string) => void;
  onOverride: (id: string) => void;
  waveformHeights: number[];
}

export function LiveIntelligencePanel(_props: LiveIntelligencePanelProps) {
  return <aside data-component="LiveIntelligencePanel" />;
}
