import { useMemo, useState, type ReactNode } from 'react';
import { IncidentContext } from './useIncident';
import { Incident, SeverityType } from '@/types';
import { IncidentApi } from '@/apis/incidents';
import { IncidentDto } from '@/dtos/incidents';
import { INITIAL_INCIDENTS } from '@/data/initialIncidents';
import { addMilliseconds, uuidv7ToDate } from '@/lib/utils';

export function IncidentProvider({ children }: { children: ReactNode }) {
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-0042');

    const activeIncident = useMemo(
        () => incidents.find(inc => inc.id === selectedIncidentId) || incidents[0],
        [selectedIncidentId, incidents]
    );

    function fetchIncidents() {
        IncidentApi.readIncidents({ page: 1, size: 100 })
            .then((result: IncidentDto[]) => {
                console.log(`result: ${result}`);
                if (result.length === 0) return;
                setIncidents(result.map<Incident>((r) => ({
                    ...r,
                    responder: {
                        name: r.responder?.name ?? '',
                        distance: r.responder?.distance ?? '',
                        eta: r.responder?.eta ?? '',
                        status: r.responder?.status ?? '',
                        type: r.responder?.type ?? '',
                        paramedic: r.responder?.paramedic
                    },
                    sopCitation: r.sopCitation ?? '',
                    reason: r.reason ?? '',
                    panicLevel: r.panicLevel ?? "",
                    distressScore: r.distressScore ?? 0,
                    caller: r.caller ?? "",
                    occurDateTime: r.occurDateTime ?? new Date().toLocaleString(),
                    lang: r.lang ?? "",
                    priority: r.priority ?? 0,
                    location: r.location ?? '',
                    transcript: r.transcript.map((t) => {
                        const call_id = t.call_id;
                        const datetime = uuidv7ToDate(call_id);
                        const newDatetime = addMilliseconds(datetime, t.start_duration)
                        return {
                            time: newDatetime.toTimeString(),
                            speaker: t.role,
                            text: t.transcript,
                            highlight: undefined
                        }
                    }),
                    type: r.type ?? undefined,
                    severity: (r.severity?.toLowerCase() as Exclude<SeverityType, SeverityType.ALL> ?? SeverityType.MODERATE),
                    contradiction: r.contradiction ?? undefined,
                })));
            })
            .catch((e) => {
                console.error(e)
            });
    }


    return (
        <IncidentContext value={{
            incidents,
            activeIncident,
            selectedIncidentId,
            setIncidents,
            setSelectedIncidentId,
            fetchIncidents,
        }}>
            {children}
        </IncidentContext>
    );
}
