import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { IncidentContext } from './useIncident';
import { Incident, SeverityType } from '@/types';
import { IncidentApi } from '@/apis/incidents';
import { IncidentDto, IncidentDtoSchema, TranscriptItem } from '@/dtos/incidents';
import { INITIAL_INCIDENTS } from '@/data/initialIncidents';
import { addMilliseconds, uuidv7ToDate } from '@/lib/utils';
import { useSSE } from '@/hooks/useSSE';
import { CallTranscriptAPI } from '@/apis/call-transcripts';

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

    const { data: callTranscriptData } = useSSE(enabled, CallTranscriptAPI.connectTranscriptEventSource)
    useEffect(() => {
        if (callTranscriptData != null && Array.isArray(callTranscriptData) && callTranscriptData.length > 0) {
            const parsedData = callTranscriptData.map((v) => IncidentDtoSchema.parse(v))
            const incidentIdsSet = new Set(callTranscriptData.map((d) => d.id));
            setIncidents((prev) => {
                return prev.map<Incident>((oldV) => {
                    if (incidentIdsSet.has(oldV.id)) {
                        const currIncident = parsedData.find((newData) => newData.id == oldV.id)
                        if (!currIncident) return oldV;
                        return {
                            ...currIncident,
                            transcript: currIncident.transcript.map(transcriptItemToUtterance),
                            title: currIncident.title ?? oldV.title,
                            location: currIncident.location ?? oldV.location,
                            type: currIncident.type ?? oldV.type,
                            priority: currIncident.priority ?? oldV.priority,
                            severity: (currIncident.severity?.toLowerCase() as Incident["severity"]) ?? oldV.severity,
                            lang: currIncident.lang ?? '',
                            occurDateTime: currIncident.occurDateTime ?? new Date().toLocaleString(),
                            sopCitation: currIncident.sopCitation ?? '',
                            reason: currIncident.reason ?? '',
                            panicLevel: currIncident.panicLevel ?? "",
                            distressScore: currIncident.distressScore ?? 0,
                            caller: currIncident.caller ?? "",
                            contradiction: currIncident.contradiction ?? undefined,
                            responder: {
                                name: currIncident.responder?.name ?? '',
                                distance: currIncident.responder?.distance ?? '',
                                eta: currIncident.responder?.eta ?? '',
                                status: currIncident.responder?.status ?? '',
                                type: currIncident.responder?.type ?? '',
                                paramedic: currIncident.responder?.paramedic
                            },
                        }
                    }
                    return oldV
                })
            })
        }
    }, [callTranscriptData])

    const { data: incidentData } = useSSE(enabled, IncidentApi.connectIncidentEvenSource)
    useEffect(() => {
        if (!enabled) return;
        if (incidentData != null) {
            const parsedData = IncidentDtoSchema.parse(incidentData)
            setIncidents((prev) => {
                const newIncident = {
                    ...parsedData,
                    transcript: parsedData.transcript.map(transcriptItemToUtterance),
                    title: parsedData.title ?? "",
                    location: parsedData.location ?? "",
                    type: parsedData.type ?? undefined,
                    priority: parsedData.priority ?? 0,
                    severity: (parsedData.severity?.toLowerCase() as Incident["severity"]) ?? SeverityType.MODERATE,
                    lang: parsedData.lang ?? '',
                    occurDateTime: parsedData.occurDateTime ?? new Date().toLocaleString(),
                    sopCitation: parsedData.sopCitation ?? '',
                    reason: parsedData.reason ?? '',
                    panicLevel: parsedData.panicLevel ?? "",
                    distressScore: parsedData.distressScore ?? 0,
                    caller: parsedData.caller ?? "",
                    contradiction: parsedData.contradiction ?? undefined,
                    responder: {
                        name: parsedData.responder?.name ?? '',
                        distance: parsedData.responder?.distance ?? '',
                        eta: parsedData.responder?.eta ?? '',
                        status: parsedData.responder?.status ?? '',
                        type: parsedData.responder?.type ?? '',
                        paramedic: parsedData.responder?.paramedic
                    },
                }
                if (prev.some((v) => v.id == parsedData.id)) {
                    return prev.map<Incident>((inc) => {
                        if (inc.id === parsedData.id)
                            return newIncident
                        return inc;
                    }
                    )
                } else {
                    return [newIncident, ...prev]
                }
            }
            );
        }
    }, [incidentData])

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
