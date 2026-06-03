# Guide: `ScenarioSimulator.tsx`

**Owner:** Somesh (after `MetricsHeader.tsx`)  
**File:** `src/components/ScenarioSimulator.tsx`  
**Where it appears:** **Simulation** tab (full screen below header)

---

## What you are building

A **training simulator** form: operators configure a fake emergency (fire, medical, etc.), press **Run simulation**, and see a **terminal log** of AI steps. The parent (`App.tsx`) creates a fake incident `SIM-9999` and switches to the Dashboard — your job is the form + log UI.

---

## Important idea: “controlled components”

Every input’s `value` comes from props. Every change calls a `set...` function from props. You do **not** use `useState` for `simScenarioName`, `simLocation`, etc.

Pattern:

```tsx
<input
  value={simScenarioName}
  onChange={(e) => setSimScenarioName(e.target.value)}
/>
```

This is called a **controlled input**. The parent owns the data; you only display and edit it.

---

## All props grouped

### Form fields

| Prop | Setter | UI control |
|------|--------|------------|
| `simScenarioName` | `setSimScenarioName` | Text input |
| `simIncidentType` | `setSimIncidentType` | Buttons or `<select>` |
| `simPersona` | `setSimPersona` | Text input or select |
| `simLanguage` | `setSimLanguage` | Text input or select |
| `simLocation` | `setSimLocation` | Text input |
| `simMultiCallers` | `setSimMultiCallers` | Checkbox |
| `simCallerCount` | `setSimCallerCount` | Range slider `1–5` |
| `simInjectComplication` | `setSimInjectComplication` | Checkbox |

`simIncidentType` type:

```ts
'medical' | 'fire' | 'crime' | 'accident' | 'flood'
```

### Run / status

| Prop | Usage |
|------|--------|
| `onInitiateSimulation` | Call when user clicks **Run simulation** |
| `isSimulating` | Disable button + show loading state |
| `simLogFeed` | `string[]` — lines to show in terminal |
| `theme` | Dark/light |

---

## Layout (two columns on desktop)

```
┌─────────────────────┬─────────────────────┐
│  FORM (left 45%)    │  LOG TERMINAL (right)│
│  - scenario name    │  > [14:22:01] ...    │
│  - type buttons     │  > [14:22:03] ...    │
│  - persona          │                      │
│  - Run button       │  stats cards         │
└─────────────────────┴─────────────────────┘
```

```tsx
<section className="flex-1 flex flex-col md:flex-row overflow-hidden">
```

---

## Step-by-step — left column (form)

### Step 1 — Section title

```tsx
<h2 className="text-lg font-black uppercase">Scenario simulator</h2>
<p className="text-xs text-slate-500">Configure AI training vectors for operator drills.</p>
```

### Step 2 — Scenario name

```tsx
<label className="text-[9px] font-black uppercase text-slate-400">Scenario name</label>
<input
  value={simScenarioName}
  onChange={(e) => setSimScenarioName(e.target.value)}
  className="w-full px-3 py-2 text-xs rounded-lg border ..."
/>
```

### Step 3 — Incident type (5 buttons)

```tsx
const types = ['medical', 'fire', 'crime', 'accident', 'flood'] as const;

{types.map((t) => (
  <button
    key={t}
    type="button"
    onClick={() => setSimIncidentType(t)}
    className={simIncidentType === t ? 'bg-[#E63946] text-white' : '...'}
  >
    {t}
  </button>
))}
```

### Step 4 — Persona & language

Two inputs or `<select>` elements with preset options, e.g.:

- Persona: `Panicked Adult`, `Calm Witness`, `Elderly Caller`
- Language: `Mixed (Bahasa / Manglish)`, `English`, `Bahasa Malaysia`

Still controlled via `value` + `setSimPersona` / `setSimLanguage`.

### Step 5 — Location

Text input bound to `simLocation`.

### Step 6 — Multi-callers checkbox

```tsx
<input
  type="checkbox"
  checked={simMultiCallers}
  onChange={(e) => setSimMultiCallers(e.target.checked)}
/>
```

When checked, show slider:

```tsx
{simMultiCallers && (
  <input
    type="range"
    min={1}
    max={5}
    value={simCallerCount}
    onChange={(e) => setSimCallerCount(Number(e.target.value))}
  />
)}
```

### Step 7 — Inject complication

Second checkbox for `simInjectComplication`. Add short help text: “Adds contradiction to transcript during sim.”

### Step 8 — Run button

```tsx
<button
  type="button"
  disabled={isSimulating}
  onClick={onInitiateSimulation}
  className="w-full py-4 bg-[#E63946] text-white font-bold uppercase ..."
>
  <Play className="w-4 h-4" />
  {isSimulating ? 'Simulation running...' : 'Initiate simulation'}
</button>
```

Icons: `Play`, `Sliders`, `ShieldAlert` from lucide.

---

## Step-by-step — right column (log terminal)

### Terminal box

Dark background, monospace font:

```tsx
<div className="flex-1 min-h-[280px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-y-auto">
  <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 uppercase text-[10px]">
    MERS_SYSLOG // LIVE
  </div>
  {simLogFeed.map((line, i) => (
    <div key={i} className="text-slate-300 mb-1">
      <span className="text-slate-500 font-bold">MERS_SYSLOG:</span> {line}
    </div>
  ))}
</div>
```

Newest-first vs oldest-first: pick one (parent prepends new lines — **newest at top** works well).

### Optional stat cards

Static or derived UI:

- “Engine status: ONLINE”
- “Latency: 42ms”
- Show `isSimulating` as green pulse dot

---

## What happens when user clicks Run (read only)

You do not code this — `App.tsx` does:

1. Creates incident `SIM-9999` with your form values  
2. Sets `isSimulating` true  
3. Appends to `simLogFeed`  
4. Switches tab to `dashboard`  
5. After ~20 seconds, simulation ends  

Your button only calls `onInitiateSimulation()`.

---

## How to test

1. Open **Simulation** tab.  
2. Change fields — they should keep values when switching tabs and coming back.  
3. Click **Initiate simulation** → should jump to Dashboard with `SIM-9999` in sidebar.  
4. Log panel should show new timestamp lines while sim runs.

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| `useState` for `simScenarioName` | Use props only |
| Run button does nothing | `onClick={onInitiateSimulation}` not `onInitiateSimulation()` on render |
| Checkbox not updating | Use `checked={simMultiCallers}` not `defaultChecked` |
| `setSimCallerCount('3')` | Slider value must be number: `Number(e.target.value)` |

---

## Done checklist

- [ ] All form fields bound to props
- [ ] Incident type selector works
- [ ] Multi-caller slider only when checkbox on
- [ ] Run button calls `onInitiateSimulation`
- [ ] Disabled while `isSimulating`
- [ ] Log shows all `simLogFeed` lines
- [ ] Two-column layout on medium+ screens
- [ ] `npm run build` passes
