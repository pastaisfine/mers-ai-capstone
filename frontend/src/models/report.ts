import z from "zod";

export type ReportFilterType =
  | "ALL"
  | ApprovalType.APPROVED
  | ApprovalType.REJECTED;

export enum SeverityType {
  CRITICAL = "CRITICAL",
  URGENT = "URGENT",
  MODERATE = "MODERATE",
}

export enum IncidentType {
  UNKNOWN = "UNKNOWN",
  MEDICAL = "MEDICAL",
  FIRE = "FIRE",
  CRIME = "CRIME",
  ACCIDENT = "ACCIDENT",
  FLOOD = "FLOOD",
}

export enum ApprovalType {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ReleaseType {
  CONFIRMED,
  NON_CONFIRMED,
}

const ReportBase = z.object({
  id: z.string(), // RECORD TOKEN
  title: z.string(),
  approvedStatus: z.enum(ApprovalType),
  createAt: z.date(),
  location: z.string(),
  incidentType: z.enum(IncidentType),
  severity: z.enum(SeverityType),
});

const SupervisingReleaseInfoSchema = z.object({
  inspector: z.string(),
  status: z.enum(ReleaseType),
});

export type SupervisingReleaseInfo = z.infer<
  typeof SupervisingReleaseInfoSchema
>;

export const OperatorNoteSchema = z.object({
  operatorVerdict: z.string(),
  notes: z.string(),
});

export type OperatorNote = z.infer<typeof OperatorNoteSchema>;

export const ArchivedReportSchema = ReportBase.extend(
  OperatorNoteSchema.shape,
).extend({
  reasoningReport: z.object({
    content: z.string(),
    sopUsed: z.array(z.string()),
  }),
  sopActions: z.array(z.string()),
  supervisingRelease: SupervisingReleaseInfoSchema,
  incidentSHA: z.string(), //MERS999-SECURE-AUDIT-SESSION-2026-001
  caller: z.string(),
  spokenDialects: z.array(z.string()),
  dispatchConfindece: z.number(), // 0 ~ 1  1 = 100%
});

export type ArchivedReport = z.infer<typeof ArchivedReportSchema>;
