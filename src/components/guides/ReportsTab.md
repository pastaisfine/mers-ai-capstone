# Guide: `ReportsTab.tsx`

**Owner:** Gan  
**File:** `src/components/ReportsTab.tsx`  
**Where it appears:** **Reports** tab (full width below header)

**Also use:** `src/data/historicalReports.ts` (mock data — already populated on starter branch)

---

## What you are building

The **archived audits** screen: search past incidents, filter approved/rejected, pick one from a list, and read a **printable debrief report** (like a PDF document). Includes **Export PDF** via the browser print dialog.

Unlike other components, you **may use `useState` inside this file** for search, filter, and selected report — parent only passes `theme`.

---

## Props

```tsx
export function ReportsTab({ theme }: ReportsTabProps) {
```

Only `theme` — everything else is **your local state**.

---

## Data import

```tsx
import { useMemo, useState } from 'react';
import { HISTORICAL_REPORTS } from '../data/historicalReports';
import type { ArchivedReport } from '../types';
```

Each item in `HISTORICAL_REPORTS` matches `ArchivedReport` in `src/types.ts`:

| Field | Example use |
|-------|-------------|
| `id` | `REP-2026-001` in list + header |
| `title`, `location` | List + narrative |
| `type` | Emoji in list (same as Evelyn’s helper) |
| `status` | `APPROVED` / `REJECTED` badge |
| `severity` | Subtext in list |
| `timestamp` | Date in list + report header |
| `caller`, `lang`, `confidence` | Section 1 narrative |
| `reasoning` | Section 2 body |
| `sopCitation` | Section 2 box |
| `actionSOP` | Section 3 numbered list |
| `operatorVerdict`, `notes` | Section 4 |
| `responderName`, `duration` | Optional in narrative |

---

## Local state to add

```tsx
const [reportSearchQuery, setReportSearchQuery] = useState('');
const [reportFilterStatus, setReportFilterStatus] =
  useState<'ALL' | 'APPROVED' | 'REJECTED'>('ALL');
const [selectedReportId, setSelectedReportId] = useState('REP-2026-001');
```

---

## Filtered list with `useMemo`

```tsx
const filteredReports = useMemo(() => {
  const q = reportSearchQuery.toLowerCase();
  return HISTORICAL_REPORTS.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(q) ||
      rep.id.toLowerCase().includes(q) ||
      rep.location.toLowerCase().includes(q);
    const matchesStatus =
      reportFilterStatus === 'ALL' || rep.status === reportFilterStatus;
    return matchesSearch && matchesStatus;
  });
}, [reportSearchQuery, reportFilterStatus]);

const selectedReport =
  HISTORICAL_REPORTS.find((r) => r.id === selectedReportId) ??
  HISTORICAL_REPORTS[0];
```

---

## Layout

```
┌──────────────────┬──────────────────────────────┐
│ Sidebar 360px    │  Debrief viewer (scroll)      │
│ - search         │  - export PDF button          │
│ - ALL/APPROVED/  │  - white "document" card      │
│   REJECTED       │  - 4 sections               │
│ - report cards   │                               │
└──────────────────┴──────────────────────────────┘
```

Root:

```tsx
<section id="screen-reports" className="flex-1 flex flex-col lg:flex-row overflow-hidden">
```

---

## Step-by-step — sidebar

### Search + filters

Same pattern as [ActiveIncidentsList.md](./ActiveIncidentsList.md):

- `Search` icon from lucide
- Pills: `ALL`, `APPROVED`, `REJECTED`

### Report cards

Click sets `setSelectedReportId(rep.id)`.

Show:

- `rep.id` in red mono
- Status badge (green APPROVED, red REJECTED)
- `{icon} {rep.title.toUpperCase()}`
- `rep.location` truncated
- `rep.severity` + date from `rep.timestamp.split(' ')[0]`

Empty state when `filteredReports.length === 0`.

---

## Step-by-step — debrief viewer

### Top bar (themed with `theme`)

- Title: **CERTIFIED DEBRIEF RECORDS**
- Subtitle about audit logs
- Button:

```tsx
<button type="button" onClick={() => window.print()}>
  <Download /> EXPORT PDF REPORT
</button>
```

`window.print()` opens browser print — user can “Save as PDF”.

### White document card

Use **white background** even in dark mode so it looks like paper:

```tsx
<div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl border relative">
```

#### Watermark (optional)

```tsx
<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-12 text-7xl font-black uppercase">
  CONFIDENTIAL MERS999 DISPATCH
</div>
```

#### Header inside document

- Red badge: “CONFIDENTIAL COGNITIVE RECORD”
- Title: “Malaysia 999 Dispatch Narrative Log”
- `RECORD TOKEN: {selectedReport.id}`
- `DATETIME: {selectedReport.timestamp}`
- Status pill: approved vs rejected

#### Section 1 — Synopsis

Paragraph template (fill with `{selectedReport....}`):

> The MERS-AI cognitive center ingested an incoming crisis stream logged at **{timestamp}**. The caller **{caller}** … location **{location}** … dialect **{lang}** … confidence **{confidence}%** … severity **{severity}**.

Use `font-serif` for body if you want formal report look.

#### Section 2 — AI reasoning

- Paragraph: `{selectedReport.reasoning}`
- Gray box: `{selectedReport.sopCitation}`

#### Section 3 — SOP actions

```tsx
{selectedReport.actionSOP.map((sop, i) => (
  <div key={i} className="flex gap-2 text-xs">
    <span className="font-bold text-[#E63946]">{i + 1}.</span>
    <span>{sop}</span>
  </div>
))}
```

#### Section 4 — Verdict

Colored box green if APPROVED, red if REJECTED:

- `DECISION: {selectedReport.operatorVerdict}`
- `Operator Note: {selectedReport.notes}`

#### Footer

Two columns:

- `MERS999-SECURE-AUDIT-{id with REP → SESSION}`
- `SUPERVISING INSPECTOR — STATUS: CONFIRMED DIRECT RELEASE`

---

## Print tip (CSS)

For better PDF export, your lead may add `@media print` rules in `globals.css` later. For now, `window.print()` is enough.

---

## How to test

1. **Reports** tab → sidebar shows 5 reports (from data file).  
2. Search “feline” → only relevant card.  
3. Filter **REJECTED** → 2 items.  
4. Click each card → right panel updates.  
5. Export PDF → print preview opens.  
6. Dark theme → sidebar dark, document still white.

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| No `useMemo` — list flickers | Filter with `useMemo` dependencies |
| Selected report undefined | Fallback to `HISTORICAL_REPORTS[0]` |
| Document same color as dark bg | Debrief card stays `bg-white text-slate-900` |
| Editing `HISTORICAL_REPORTS` in component | Data lives in `data/historicalReports.ts` |

---

## Done checklist

- [ ] Search filters by title, id, location
- [ ] Status pills work
- [ ] List selection highlights + updates detail
- [ ] Four report sections complete
- [ ] Print / PDF button works
- [ ] Empty search state
- [ ] Sidebar respects `theme`
- [ ] `npm run build` passes
