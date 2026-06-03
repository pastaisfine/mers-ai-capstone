import { ArchivedReport } from '../types';

export const HISTORICAL_REPORTS: ArchivedReport[] = [
  {
    id: 'REP-2026-001',
    type: 'fire',
    title: 'Lorong Haji Taib Building Inferno',
    location: 'Lorong Haji Taib 2, Chow Kit, Kuala Lumpur',
    severity: 'CRITICAL',
    status: 'APPROVED',
    caller: 'MR. ANWAR SHAH',
    lang: 'BM / EN',
    confidence: 96,
    sopCitation: 'Bomba Malaysia Code 4.2 (High-Rise Containment)',
    responderName: 'Bomba Sentul Base & KL Central',
    timestamp: '2026-06-02 09:30:15 UTC',
    duration: '08:45',
    reasoning:
      'Multiple industrial fuel canisters ruptured in commercial kitchen. Severe risk of radiant heat propagating across adjacent high-density wooden buildings. Emergency evacuation prioritized immediately to prevent regional cascade.',
    actionSOP: [
      'Command immediate deployment of high-pressure fog nozzle monitors to form water containment curtains.',
      'Alert Kuala Lumpur water systems command to override local hydrant pressure caps for auxiliary flow.',
      'Coordinate with municipal civil defense to open community relief facility for displaced residents.',
    ],
    operatorVerdict:
      'APPROVED & DISPATCHED - 3 heavy engines and HAZMAT suppression units deployed.',
    notes:
      'Initial panicked reports suggested 4 employees were trapped inside storage. Firefighters conducted physical search and verified 100% escape. Fire successfully subdued within 34 minutes.',
  },
  {
    id: 'REP-2026-002',
    type: 'medical',
    title: 'Feline Roof Distress Alarm Vetting',
    location: 'Jalan SS5/12, Sec 5, Petaling Jaya, Selangor',
    severity: 'MODERATE',
    status: 'REJECTED',
    caller: 'MISS LINDA OOI',
    lang: 'EN Standard',
    confidence: 38,
    sopCitation: 'MERS Low-Priority Service Vetting Protocols',
    responderName: 'None (Dispatch Blocked)',
    timestamp: '2026-06-02 08:45:00 UTC',
    duration: '01:20',
    reasoning:
      'Caller heard audible shouting/screaming on her rooftop. AI speech telemetry and ambient sensor spectral analyses cross-referenced with feline vocalization templates with 94.2% matching confidence.',
    actionSOP: [
      'Instructed caller to maintain safety parameters while investigating via flashlight from safe ground.',
      'Refuse Fire & Paramedic emergency vehicle deployment to conserve tactical resources.',
      'De-escalate caller anxiety levels and log report as false alarm.',
    ],
    operatorVerdict: 'REJECTED - Decisive feline false alarm mitigation code applied.',
    notes:
      "Miss Linda confirmed on follow-up check that she found neighbor's tabby cat perched on structural roof gutter. Threat mitigated without emergency response leakage.",
  },
  {
    id: 'REP-2026-003',
    type: 'medical',
    title: 'Acute Cerebrovascular Stroke Emergency',
    location: 'Jalan Keramat, Kampung Datuk Keramat, Kuala Lumpur',
    severity: 'URGENT',
    status: 'APPROVED',
    caller: 'DR. FADZIL',
    lang: 'BM Pure',
    confidence: 94,
    sopCitation: 'Pre-Hospital Stroke Guideline 2024 - Sec B',
    responderName: 'HKL General Hospital EMS Unit',
    timestamp: '2026-06-02 07:11:32 UTC',
    duration: '04:12',
    reasoning:
      'Adult female patient (78yo) presenting with sudden facial paralysis, severe unilateral flaccid extremity weakness, and slurred speech. Onset time confirmed under 50 minutes.',
    actionSOP: [
      'Instructed relative to maintain patient flat on left side to prevent aspiration and airway collapse.',
      'Dispatched Advanced Cardiac ambulance equipped with continuous monitoring array.',
      'Issued pre-hospital strike team alert to HKL General stroke unit to bypass common emergency triage.',
    ],
    operatorVerdict:
      'APPROVED & DISPATCHED - Highly critical neurological stroke window active.',
    notes:
      'EMS team successfully picked up patient and performed pre-activation of thrombolytic pathway. Target door-to-needle time clocked at record 28 minutes.',
  },
  {
    id: 'REP-2026-004',
    type: 'crime',
    title: 'Bukit Bintang Robbery Alarm Hoox',
    location: 'Bukit Bintang Plaza Intersection, Kuala Lumpur',
    severity: 'CRITICAL',
    status: 'REJECTED',
    caller: 'UNKNOWN CELLULAR TERMINAL',
    lang: 'EN / Manglish',
    confidence: 15,
    sopCitation: 'MERS Anti-Harassment & Prank Assessment Framework',
    responderName: 'None (Escalation Intercepted)',
    timestamp: '2026-06-02 06:12:10 UTC',
    duration: '00:52',
    reasoning:
      'A group of laughing younger males screaming robbery triggers followed by ambient mall chatter. Caller ID trace matches multiple previous prank attempts to same cellular base.',
    actionSOP: [
      'Execute background carrier database lookups for persistent harassing caller patterns.',
      'Reject police patrol unit deployment at center level.',
      'Log MSISDN device info to warning lists for legal compliance escalation.',
    ],
    operatorVerdict:
      'REJECTED - Clear malicious prank attempting resources diversion.',
    notes:
      'Operator completed warning response structure before disconnecting. Registered MSISDN for regional blacklist consideration.',
  },
  {
    id: 'REP-2026-005',
    type: 'accident',
    title: 'Federal Highway Tractor-Trailer Fuel Spill',
    location: 'Federal Highway, KM 12.4 (Westbound, Near MidValley Side)',
    severity: 'URGENT',
    status: 'APPROVED',
    caller: 'SARJIL SINGH',
    lang: 'English Standard',
    confidence: 91,
    sopCitation: 'Bomba Environmental Hazardous Containment 1.5.1',
    responderName: 'Bomba Pantai HAZMAT Unit & Traffic Patrol',
    timestamp: '2026-06-01 23:40:15 UTC',
    duration: '06:12',
    reasoning:
      'Ruptured saddle tank of heavy logistics truck spilling ~180 liters of diesel fuel across two lanes of arterial expressway. Severe skid hazard with rain expected.',
    actionSOP: [
      'Dispatch heavy engine with specialized chemical absorbent sand matrices to neutralize slick.',
      'Alert traffic police to initiate active expressway lane closures on MidValley approach.',
      'Command street sweeping vehicles to spray high-pressure surfactant.',
    ],
    operatorVerdict:
      'APPROVED & DISPATCHED - Multi-agency hazard mitigation successfully executed.',
    notes:
      'Pantai Bomba unit completely insulated coordinates. Left and center lanes reopened within 80 minutes. No active vehicular collisions resulted from the spill.',
  },
];
