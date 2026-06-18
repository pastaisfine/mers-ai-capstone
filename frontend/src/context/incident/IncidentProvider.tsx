import { useMemo, useState, type ReactNode } from 'react';
import { IncidentContext } from './useIncident';
import { Incident } from '@/types';
import { INITIAL_INCIDENTS } from '@/data/initialIncidents';

export function IncidentProvider({ children }: { children: ReactNode }) {
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-0042');

    const activeIncident = useMemo(() => incidents.find(inc => inc.id === selectedIncidentId) || incidents[0], [selectedIncidentId, incidents]);

    return <IncidentContext value={{
        incidents,
        activeIncident,
        selectedIncidentId,
        setIncidents,
        setSelectedIncidentId
    }}> {children}</ IncidentContext>
}

