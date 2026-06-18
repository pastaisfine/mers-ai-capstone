# Guide: `LiveIntelligencePanel.tsx`

**Owner:** Darren  
**File:** `src/components/LiveIntelligencePanel.tsx`  
**Where it appears:** **Dashboard** tab — **right column**

---

## What you are building

The **live intelligence** panel: call transcript, AI triage summary, SOP checklist, audio waveform, and buttons to **dispatch** or **override** severity. This is where the operator reads what the AI heard and decides what to do.

---

## Props

```tsx
export function LiveIntelligencePanel({
  activeIncident,
  theme,
  onDispatch,
  onOverride,
  waveformHeights,
}: LiveIntelligencePanelProps) {
```

| Prop | Usage |
|------|--------|
| `activeIncident` | All text/data to display |
| `theme` | Dark/light styling |
| `onDispatch(id, unitName)` | Primary action — pass incident id + responder name |
| `onOverride(id)` | Secondary — manual severity override |
| `waveformHeights` | Array of numbers (heights in px) for audio bars |

### Dispatch button example

```tsx
<button
  type="button"
  onClick={() =>
    onDispatch(activeIncident.id, activeIncident.responder.name)
  }
>
  Dispatch {activeIncident.responder.name}
</button>
```

### Override button

```tsx
<button type="button" onClick={() => onOverride(activeIncident.id)}>
  Manual override
</button>
```

---

## Recommended layout (top → bottom)

1. Section tabs or labels: **Live feed** | **Triage** | **SOP**
2. Waveform + transcript
3. Triage scores + entities
4. SOP citation + numbered steps
5. Responder mini-card + action buttons

Use one column: `flex flex-col h-full overflow-hidden`.

---

## Step-by-step

### Step 1 — Panel shell

```tsx
<aside className={`w-full lg:w-[380px] flex flex-col border-l shrink-0 overflow-hidden ${
  isDark ? 'bg-[#0B0D12] border-[#2D334A]' : 'bg-white border-slate-200'
}`}>
```

### Step 2 — Waveform (use `waveformHeights`)

Parent sends ~14 numbers that change on critical calls. Render as vertical bars:

```tsx
<div className="flex items-end gap-0.5 h-8 px-4">
  {waveformHeights.map((h, i) => (
    <div
      key={i}
      className="w-1 bg-[#E63946] rounded-sm"
      style={{ height: `${h}px` }}
    />
  ))}
</div>
```

Add `Volume2` icon from lucide beside it.

### Step 3 — Transcript

Map `activeIncident.transcript`:

```tsx
{activeIncident.transcript.map((line, i) => (
  <div key={i} className="text-xs font-mono">
    <span className="text-slate-500">{line.time}</span>{' '}
    <span className={line.speaker === 'Caller' ? 'text-[#E63946]' : 'text-blue-400'}>
      {line.speaker}:
    </span>{' '}
    {line.text}
  </div>
))}
```

Put inside `overflow-y-auto flex-1` container.

**Optional:** if `line.highlight`, wrap words in `<span className="bg-red-500/20">`.

### Step 4 — Contradiction banner

Only if `activeIncident.contradiction` exists:

```tsx
{activeIncident.contradiction && (
  <div className="p-2 bg-amber-500/10 border border-amber-500 text-xs flex gap-2">
    <AlertCircle className="w-4 h-4 shrink-0" />
    {activeIncident.contradiction}
  </div>
)}
```

### Step 5 — Triage block

Display:

| Label | Value |
|-------|--------|
| Distress score | `activeIncident.distressScore` |
| Panic level | `activeIncident.panicLevel` |
| Confidence | `activeIncident.confidence`% |
| Reason | `activeIncident.reason` |
| Entities | map `activeIncident.entities` as chips |

```tsx
{activeIncident.entities.map((e) => (
  <span key={e} className="text-[10px] px-2 py-0.5 rounded bg-slate-800">{e}</span>
))}
```

### Step 6 — SOP section

- Title with `BookOpen` icon
- `activeIncident.sopCitation` in mono font
- Ordered list from `activeIncident.sopProcedure`:

```tsx
<ol className="list-none space-y-2">
  {activeIncident.sopProcedure.map((step, i) => (
    <li key={i} className="text-xs">
      <span className="text-[#E63946] font-bold">{i + 1}.</span> {step}
    </li>
  ))}
</ol>
```

### Step 7 — Responder + actions

Show `activeIncident.responder` (name, type, eta). Two buttons wired to `onDispatch` and `onOverride` as above.

---

## Optional: sub-tabs with `useState`

```tsx
const [panel, setPanel] = useState<'transcript' | 'triage' | 'sop'>('transcript');
```

Show one section at a time — good practice for React beginners.

---

## How to test

1. Select **INC-0042** — transcript should show Malay/English mix.  
2. Click **Dispatch** — footer/status may change in parent; timeline gets new event.  
3. Click **Override** — severity may flip CRITICAL ↔ URGENT in parent.  
4. Critical incident — waveform bars should animate (parent updates every 150ms).

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Dispatch does nothing | Must call `onDispatch(activeIncident.id, activeIncident.responder.name)` |
| Empty waveform | Map over `waveformHeights`, not a fixed array |
| Ignoring `theme` | Panel unreadable in light mode |
| Not scrolling long transcript | Parent `overflow-y-auto` on transcript container |

---

## Done checklist

- [ ] Waveform renders from `waveformHeights`
- [ ] Full transcript visible and scrollable
- [ ] Triage fields + entities shown
- [ ] SOP list numbered
- [ ] Contradiction shown when present
- [ ] Dispatch and Override wired
- [ ] Dark + light themes
- [ ] `npm run build` passes
