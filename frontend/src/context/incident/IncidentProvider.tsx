import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { IncidentContext } from './useIncident';
import { Incident, SeverityType } from '@/types';
import { IncidentApi } from '@/apis/incidents';
import { IncidentDto, TranscriptItem } from '@/dtos/incidents';
import { INITIAL_INCIDENTS } from '@/data/initialIncidents';
import { addMilliseconds, uuidv7ToDate } from '@/lib/utils';
import { useSSE } from '@/hooks/useSSE';

function transcriptItemToUtterance(t: TranscriptItem): Incident["transcript"][number] {
    const call_id = t.call_id;
    const datetime = uuidv7ToDate(call_id);
    const newDatetime = addMilliseconds(datetime, t.start_duration)
    return {
        time: newDatetime.toTimeString(),
        speaker: t.role,
        text: t.transcript,
        highlight: undefined
    }
}

export function IncidentProvider({ children }: { children: ReactNode }) {
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-0042');
    const [enabled, setEnabled] = useState<boolean>(false);

    const activeIncident = useMemo(
        () => incidents.find(inc => inc.id === selectedIncidentId) || incidents[0],
        [selectedIncidentId, incidents]
    );

    const { data } = useSSE(enabled)
    useEffect(() => {
        if (data != null && data.length > 0) {
            const callId = data[0].call_id
            setIncidents((prev) => {
                return prev.map((incident) => (
                    incident.callId === callId
                        ? {
                            ...incident,
                            transcript: data.map(transcriptItemToUtterance),
                        }
                        : incident
                ))
            })
        }
    }, [data])

    useEffect(() => {
        if (!enabled) return;

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/incidents/stream`;
        const es = new EventSource(url);

        es.onmessage = (event) => {
            try {
                const update = JSON.parse(event.data);
                setIncidents((prev) =>
                    prev.map((inc) =>
                        inc.callId === update.call_id
                            ? {
                                ...inc,
                                title: update.title ?? inc.title,
                                location: update.location ?? inc.location,
                                type: update.type ?? inc.type,
                                priority: update.priority ?? inc.priority,
                                severity: update.severity?.toLowerCase() ?? inc.severity,
                            }
                            : inc
                    )
                );
            } catch (e) {
                console.error("Incident SSE parse error", e);
            }
        };

        es.onerror = () => es.close();
        return () => es.close();
    }, [enabled])

    function fetchIncidents() {
        IncidentApi.readIncidents({ page: 1, size: 100 })
            .then((result: IncidentDto[]) => {
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
                    transcript: r.transcript.map(transcriptItemToUtterance),
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
            setSSEEnabled: setEnabled
        }}>
            {children}
        </IncidentContext>
    );
}
