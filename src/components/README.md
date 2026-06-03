# MERS-AI — Component starter kit (index)

Welcome. This folder has **empty component files** for you to build. Each teammate owns **one file** and follows **one detailed guide** in the `guides/` folder.

---

## Quick start (everyone)

1. Install and run from the project root:

   ```bash
   npm install
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000).

3. Open **your** guide below and follow it step by step.

4. Before opening a pull request, run:

   ```bash
   npm run build
   ```

   Fix any TypeScript errors before asking for review.

---

## Who builds what

| Owner | File to edit | Detailed guide |
|-------|--------------|----------------|
| **Somesh** | `MetricsHeader.tsx` | [guides/MetricsHeader.md](./guides/MetricsHeader.md) |
| **Evelyn** | `ActiveIncidentsList.tsx` | [guides/ActiveIncidentsList.md](./guides/ActiveIncidentsList.md) |
| **Qristina** | `TacticalWorkspace.tsx` | [guides/TacticalWorkspace.md](./guides/TacticalWorkspace.md) |
| **Darren** | `LiveIntelligencePanel.tsx` | [guides/LiveIntelligencePanel.md](./guides/LiveIntelligencePanel.md) |
| **Qaeffy** | `TacticalFooter.tsx` | [guides/TacticalFooter.md](./guides/TacticalFooter.md) |
| **Somesh** | `ScenarioSimulator.tsx` | [guides/ScenarioSimulator.md](./guides/ScenarioSimulator.md) |
| **Gan** | `ReportsTab.tsx` | [guides/ReportsTab.md](./guides/ReportsTab.md) |

> **Somesh** owns two files (header + simulator). Finish `MetricsHeader` first, then `ScenarioSimulator`.

---

## Rules for the whole team

1. **Do not rename** the exported component or change prop types without telling the team ( `App.tsx` depends on them ).
2. **Do not delete** your `.tsx` file — only fill in the UI inside it.
3. Support **dark** and **light** theme using the `theme` prop where your component receives it.
4. Use **Tailwind CSS** classes for styling (already set up in `src/app/globals.css`).
5. Use **lucide-react** for icons: `import { IconName } from 'lucide-react'`.

---

## Shared files (read-only unless your guide says otherwise)

| File | Purpose |
|------|---------|
| `src/App.tsx` | All app state, tabs, mock incidents — **do not edit** unless your lead says so |
| `src/types.ts` | `Incident` and `ArchivedReport` TypeScript types |
| `src/data/historicalReports.ts` | Mock data for **Gan** (Reports tab) |

---

## How the dashboard fits together

When the **Dashboard** tab is active, `App.tsx` renders:

```
┌─────────────────────────────────────────────────────────┐
│ MetricsHeader (Somesh)                                  │
├──────────────┬────────────────────┬─────────────────────┤
│ Active       │ TacticalWorkspace  │ LiveIntelligence    │
│ IncidentsList│ (Qristina)         │ Panel (Darren)      │
│ (Evelyn)     │                    │                     │
├──────────────┴────────────────────┴─────────────────────┤
│ TacticalFooter (Qaeffy)                                 │
└─────────────────────────────────────────────────────────┘
```

**Simulation** tab = `ScenarioSimulator` only. **Reports** tab = `ReportsTab` only.

---

## Need the finished design?

Ask your lead for the branch that has the full UI (e.g. `main`). You can compare your file to the old version for layout ideas — but **write your own code** in the starter-kit branch.

---

## Help

- Stuck on React basics: [React docs — Learn](https://react.dev/learn)
- Stuck on Tailwind: [Tailwind docs](https://tailwindcss.com/docs)
- Stuck on your props: open your guide’s **“Props explained”** section
