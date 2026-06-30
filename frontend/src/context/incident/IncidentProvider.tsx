import { useEffect, useMemo, useState, type ReactNode } from 'react';
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
    // On incident change, fetch existing transcripts and get the call_id for Realtime
    useEffect(() => {
        if (!selectedIncidentId) return;

        let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

        async function loadTranscripts() {
            try {
                const res = await fetch(`${BACKEND_URL}/incidents/${selectedIncidentId}/transcripts`);
                if (!res.ok) return;
                const data = await res.json();

                const { call_id, transcripts } = data as {
                    call_id: string | null;
                    transcripts: {
                        id: string;
                        seq: number;
                        role: string;
                        transcript: string;
                        start_duration: number;
                        end_duration: number;
                    }[];
                };

                // Seed existing transcripts from DB
                if (transcripts.length > 0) {
                    setIncidents(prev =>
                        prev.map(inc =>
                            inc.id === selectedIncidentId
                                ? {
                                    ...inc,
                                    callId: call_id ?? inc.callId,
                                    transcript: transcripts.map(t => ({
                                        time: formatMs(t.start_duration),
                                        speaker: t.role === 'agent' ? 'Operator' : 'Caller',
                                        text: t.transcript,
                                    })),
                                }
                                : inc
                        )
                    );
                }

                // Subscribe to live inserts for this call
                if (call_id) {
                    realtimeChannel = supabase
                        .channel(`transcripts-${call_id}`)
                        .on(
                            'postgres_changes',
                            {
                                event: 'INSERT',
                                schema: 'public',
                                table: 'call_transcripts',
                                filter: `call_id=eq.${call_id}`,
                            },
                            payload => {
                                const row = payload.new as {
                                    role: string;
                                    transcript: string;
                                    start_duration: number;
                                };
                                setIncidents(prev =>
                                    prev.map(inc =>
                                        inc.id === selectedIncidentId
                                            ? {
                                                ...inc,
                                                transcript: [
                                                    ...inc.transcript,
                                                    {
                                                        time: formatMs(row.start_duration),
                                                        speaker: row.role === 'agent' ? 'Operator' : 'Caller',
                                                        text: row.transcript,
                                                    },
                                                ],
                                            }
                                            : inc
                                    )
                                );
                            }
                        )
                        .subscribe();
                }
            } catch (err) {
                console.error('[IncidentProvider] Failed to load transcripts:', err);
            }
        }

        loadTranscripts();

        return () => {
            if (realtimeChannel) supabase.removeChannel(realtimeChannel);
        };
    }, [selectedIncidentId]);

    return (
        <IncidentContext value={{
            incidents,
            activeIncident,
            selectedIncidentId,
            setIncidents,
            setSelectedIncidentId,
        }}>
            {children}
        </IncidentContext>
    );
}
