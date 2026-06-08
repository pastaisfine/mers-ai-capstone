import { ApprovalType, IncidentType, SeverityType } from "@/models/report";
import { ArchivedReport } from "../types";

export const HISTORICAL_REPORTS: ArchivedReport[] = [
  {
    id: "REP-2026-001",
    title: "Lorong Haji Taib Building Inferno",
    approvedStatus: ApprovalType.APPROVED,
    createAt: new Date("2026-06-02 09:30:15 UTC"),
    location: "Lorong Haji Taib 2, Chow Kit, Kuala Lumpur",
    incidentType: IncidentType.FIRE,
    severity: SeverityType.CRITICAL,
    reasoningReport: {
      content:
        "Multiple industrial fuel canisters ruptured in commercial kitchen. Severe risk of radiant heat propagating across adjacent high-density wooden buildings. Emergency evacuation prioritized immediately to prevent regional cascade.",
      sopUsed: ["Bomba Malaysia Code 4.2 (High-Rise Containment)"],
    },
    sopActions: [
      "Command immediate deployment of high-pressure fog nozzle monitors to form water containment curtains.",
      "Alert Kuala Lumpur water systems command to override local hydrant pressure caps for auxiliary flow.",
      "Coordinate with municipal civil defense to open community relief facility for displaced residents.",
    ],
    operatorVerdict:
      "APPROVED & DISPATCHED - 3 heavy engines and HAZMAT suppression units deployed.",
    notes:
      "Initial panicked reports suggested 4 employees were trapped inside storage. Firefighters conducted physical search and verified 100% escape. Fire successfully subdued within 34 minutes.",
    supervisingRelease: {
      inspector: "INSPECTOR AHMED",
      status: 0, // Assuming CONFIRMED maps to enum index 0
    },
    incidentSHA: "MERS999-SECURE-AUDIT-SESSION-2026-001",
    caller: "MR. ANWAR SHAH",
    spokenDialects: ["BM", "EN"],
    dispatchConfindece: 0.96,
  },
  {
    id: "REP-2026-002",
    title: "Feline Roof Distress Alarm Vetting",
    approvedStatus: ApprovalType.REJECTED,
    createAt: new Date("2026-06-02 08:45:00 UTC"),
    location: "Jalan SS5/12, Sec 5, Petaling Jaya, Selangor",
    incidentType: IncidentType.MEDICAL,
    severity: SeverityType.MODERATE,
    reasoningReport: {
      content:
        "Caller heard audible shouting/screaming on her rooftop. AI speech telemetry and ambient sensor spectral analyses cross-referenced with feline vocalization templates with 94.2% matching confidence.",
      sopUsed: ["MERS Low-Priority Service Vetting Protocols"],
    },
    sopActions: [
      "Instructed caller to maintain safety parameters while investigating via flashlight from safe ground.",
      "Refuse Fire & Paramedic emergency vehicle deployment to conserve tactical resources.",
      "De-escalate caller anxiety levels and log report as false alarm.",
    ],
    operatorVerdict:
      "REJECTED - Decisive feline false alarm mitigation code applied.",
    notes:
      "Miss Linda confirmed on follow-up check that she found neighbor's tabby cat perched on structural roof gutter. Threat mitigated without emergency response leakage.",
    supervisingRelease: {
      inspector: "SYSTEM AUTOMATION",
      status: 1, // Assuming NON_CONFIRMED maps to enum index 1
    },
    incidentSHA: "MERS999-SECURE-AUDIT-SESSION-2026-002",
    caller: "MISS LINDA OOI",
    spokenDialects: ["EN Standard"],
    dispatchConfindece: 0.38,
  },
  {
    id: "REP-2026-003",
    title: "Acute Cerebrovascular Stroke Emergency",
    approvedStatus: ApprovalType.APPROVED,
    createAt: new Date("2026-06-02 07:11:32 UTC"),
    location: "Jalan Keramat, Kampung Datuk Keramat, Kuala Lumpur",
    incidentType: IncidentType.MEDICAL,
    severity: SeverityType.URGENT,
    reasoningReport: {
      content:
        "Adult female patient (78yo) presenting with sudden facial paralysis, severe unilateral flaccid extremity weakness, and slurred speech. Onset time confirmed under 50 minutes.",
      sopUsed: ["Pre-Hospital Stroke Guideline 2024 - Sec B"],
    },
    sopActions: [
      "Instructed relative to maintain patient flat on left side to prevent aspiration and airway collapse.",
      "Dispatched Advanced Cardiac ambulance equipped with continuous monitoring array.",
      "Issued pre-hospital strike team alert to HKL General stroke unit to bypass common emergency triage.",
    ],
    operatorVerdict:
      "APPROVED & DISPATCHED - Highly critical neurological stroke window active.",
    notes:
      "EMS team successfully picked up patient and performed pre-activation of thrombolytic pathway. Target door-to-needle time clocked at record 28 minutes.",
    supervisingRelease: {
      inspector: "DR. FADZIL (Self-Signed)",
      status: 0,
    },
    incidentSHA: "MERS999-SECURE-AUDIT-SESSION-2026-003",
    caller: "DR. FADZIL",
    spokenDialects: ["BM Pure"],
    dispatchConfindece: 0.94,
  },
  {
    id: "REP-2026-004",
    title: "Bukit Bintang Robbery Alarm Hoox",
    approvedStatus: ApprovalType.REJECTED,
    createAt: new Date("2026-06-02 06:12:10 UTC"),
    location: "Bukit Bintang Plaza Intersection, Kuala Lumpur",
    incidentType: IncidentType.CRIME,
    severity: SeverityType.CRITICAL,
    reasoningReport: {
      content:
        "A group of laughing younger males screaming robbery triggers followed by ambient mall chatter. Caller ID trace matches multiple previous prank attempts to same cellular base.",
      sopUsed: ["MERS Anti-Harassment & Prank Assessment Framework"],
    },
    sopActions: [
      "Execute background carrier database lookups for persistent harassing caller patterns.",
      "Reject police patrol unit deployment at center level.",
      "Log MSISDN device info to warning lists for legal compliance escalation.",
    ],
    operatorVerdict:
      "REJECTED - Clear malicious prank attempting resources diversion.",
    notes:
      "Operator completed warning response structure before disconnecting. Registered MSISDN for regional blacklist consideration.",
    supervisingRelease: {
      inspector: "CYBER AUDIT DESK",
      status: 1,
    },
    incidentSHA: "MERS999-SECURE-AUDIT-SESSION-2026-004",
    caller: "UNKNOWN CELLULAR TERMINAL",
    spokenDialects: ["EN", "Manglish"],
    dispatchConfindece: 0.15,
  },
  {
    id: "REP-2026-005",
    title: "Federal Highway Tractor-Trailer Fuel Spill",
    approvedStatus: ApprovalType.APPROVED,
    createAt: new Date("2026-06-01 23:40:15 UTC"),
    location: "Federal Highway, KM 12.4 (Westbound, Near MidValley Side)",
    incidentType: IncidentType.ACCIDENT,
    severity: SeverityType.URGENT,
    reasoningReport: {
      content:
        "Ruptured saddle tank of heavy logistics truck spilling ~180 liters of diesel fuel across two lanes of arterial expressway. Severe skid hazard with rain expected.",
      sopUsed: ["Bomba Environmental Hazardous Containment 1.5.1"],
    },
    sopActions: [
      "Dispatch heavy engine with specialized chemical absorbent sand matrices to neutralize slick.",
      "Alert traffic police to initiate active expressway lane closures on MidValley approach.",
      "Command street sweeping vehicles to spray high-pressure surfactant.",
    ],
    operatorVerdict:
      "APPROVED & DISPATCHED - Multi-agency hazard mitigation successfully executed.",
    notes:
      "Pantai Bomba unit completely insulated coordinates. Left and center lanes reopened within 80 minutes. No active vehicular collisions resulted from the spill.",
    supervisingRelease: {
      inspector: "OFFICER SARJIL",
      status: 0,
    },
    incidentSHA: "MERS999-SECURE-AUDIT-SESSION-2026-005",
    caller: "SARJIL SINGH",
    spokenDialects: ["English Standard"],
    dispatchConfindece: 0.91,
  },
];
