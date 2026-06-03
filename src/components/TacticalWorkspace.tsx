'use client';

import type { Incident } from '../types';

/**
 * Center panel: tactical map, incident header, timeline, and responder ETA cards.
 * See src/components/guides/TacticalWorkspace.md
 */

export interface TacticalWorkspaceProps {
  activeIncident: Incident;
  theme: 'dark' | 'light';
  currentTimeText: string;
}

export function TacticalWorkspace(_props: TacticalWorkspaceProps) {
  return <section data-component="TacticalWorkspace" />;
}
