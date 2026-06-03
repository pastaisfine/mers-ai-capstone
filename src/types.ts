export interface Incident {
  id: string;
  type: 'medical' | 'fire' | 'crime' | 'accident' | 'flood';
  title: string;
  location: string;
  severity: 'CRITICAL' | 'URGENT' | 'MODERATE' | 'RESOLVED';
  priority: number;
  lang: string;
  caller: string;
  duration: string;
  distressScore: number;
  panicLevel: string;
  entities: string[];
  reason: string;
  confidence: number;
  contradiction?: string;
  sopCitation: string;
  sopProcedure: string[];
  responder: {
    name: string;
    type: string;
    distance: string;
    eta: string;
    status: string;
    paramedic?: string;
  };
  timeline: { time: string; event: string; isAlert?: boolean }[];
  transcript: { time: string; speaker: string; text: string; highlight?: boolean }[];
  coordinates: { x: number; y: number; lat: number; lng: number };
  status: {
    location?: string;
    transcription?: string;
    triage?: string;
    sop?: string;
    dispatch?: string;
  };
}

export interface ArchivedReport {
  id: string;
  type: 'medical' | 'fire' | 'crime' | 'accident' | 'flood';
  title: string;
  location: string;
  severity: 'CRITICAL' | 'URGENT' | 'MODERATE' | 'RESOLVED';
  status: 'APPROVED' | 'REJECTED';
  caller: string;
  lang: string;
  confidence: number;
  sopCitation: string;
  responderName: string;
  timestamp: string;
  duration: string;
  reasoning: string;
  actionSOP: string[];
  operatorVerdict: string;
  notes: string;
}
