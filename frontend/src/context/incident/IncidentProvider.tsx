import { useMemo, useState, type ReactNode } from 'react';
import { IncidentContext } from './useIncident';
import { Incident, SeverityType } from '@/types';
import { INITIAL_INCIDENTS } from '@/data/initialIncidents';
import { IncidentApi } from '@/apis/incidents';
import { IncidentDto } from '@/dtos/incidents';

export function IncidentProvider({ children }: { children: ReactNode }) {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-0042');

    const activeIncident = useMemo(() => incidents.find(inc => inc.id === selectedIncidentId) || incidents[0], [selectedIncidentId, incidents]);

    function fetchIncidents() {
        IncidentApi.readIncidents({
            page: 1, size: 100
        }).then((result: IncidentDto[]) => setIncidents(result.map<Incident>((r) => {
            return {
                ...r,
                type: r.type ?? undefined,
                severity: (r.severity?.toLowerCase() as Exclude<SeverityType, SeverityType.ALL> ?? SeverityType.MODERATE),
                contradiction: r.contradiction ?? undefined
            }
        })))
    }

    return <IncidentContext value={{
        incidents,
        activeIncident,
        selectedIncidentId,
        setIncidents,
        setSelectedIncidentId,
        fetchIncidents
    }}> {children}</ IncidentContext>
}

