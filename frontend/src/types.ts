import { ArchivedReport as ArchivedReportModel } from "./models/report";
export interface Incident {
  id: string;
  type?: "medical" | "fire" | "crime" | "accident" | "flood";
  title: string;
  location: string;
  severity:
    | SeverityType.CRITICAL
    | SeverityType.URGENT
    | SeverityType.MODERATE
    | SeverityType.RESOLVED;
  priority: number;
  lang: string;
  occurDateTime: string;
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
  transcript: {
    time: string;
    speaker: string;
    text: string;
    highlight?: boolean;
  }[];
  coordinates?: { lat: number; lng: number };
  status: {
    location?: string;
    transcription?: string;
    triage?: string;
    sop?: string;
    dispatch?: string;
  };
}

export type ArchivedReport = ArchivedReportModel;

export type Theme = "dark" | "light";

export enum SeverityType {
  ALL = "all",
  CRITICAL = "critical",
  URGENT = "urgent",
  MODERATE = "moderate",
  RESOLVED = "resolved",
}

export enum TabName {
  DASHBOARD = "dashboard",
  SIMULATION = "simulation",
  REPORTS = "reports",
}
