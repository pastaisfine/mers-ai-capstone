'use client';

import type { Incident } from '../types';

/**
 * Left sidebar: searchable incident queue with severity filters and selection.
 * See src/components/guides/ActiveIncidentsList.md
 */

export interface ActiveIncidentsListProps {
  incidents: Incident[];
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterSeverity: string;
  setFilterSeverity: (severity: string) => void;
  theme: 'dark' | 'light';
}

export function ActiveIncidentsList(_props: ActiveIncidentsListProps) {
  return <aside data-component="ActiveIncidentsList" />;
}
