# Guide: `TacticalWorkspace.tsx`

**Owner:** Qristina  
**File:** `src/components/TacticalWorkspace.tsx`  
**Where it appears:** **Dashboard** tab — **center column** (largest area)

---

## What you are building

The **tactical map workspace**: incident summary at the top, an interactive-style **map** in the middle, **timeline** of events, and **nearby responder** cards. This is the “command center” view operators stare at during a call.

---

## What you receive from the parent

Only **one** incident at a time: `activeIncident`. When Evelyn selects a different row in the sidebar, `App.tsx` passes a new `activeIncident` — your whole component re-renders with new data.

```tsx
export function TacticalWorkspace({
  activeIncident,
  theme,
  currentTimeText,
}: TacticalWorkspaceProps) {
```

---

## `activeIncident` fields you will use

| Field | Use in UI |
|-------|-----------|
| `title`, `location`, `severity`, `priority` | Header block |
| `caller`, `duration`, `lang` | Subheader meta |
| `coordinates.x`, `coordinates.y` | Position on SVG map (pixels) |
| `coordinates.lat`, `coordinates.lng` | Show as text overlay |
| `timeline[]` | List `{ time, event }` |
| `responder` | Card: name, type, distance, eta, status, paramedic |

Full shape: see `Incident` in `src/types.ts`.

---

## Layout structure (recommended)

```
┌──────────────────────────────────────┐
│ INCIDENT HEADER (title, severity)    │
├──────────────────────────────────────┤
│                                      │
│         SVG MAP (flex-1)             │
│         + pin at coordinates         │
│                                      │
├──────────────────────────────────────┤
│ Timeline | Responder cards           │
└──────────────────────────────────────┘
```

Wrap in:

```tsx
<section className="flex-1 flex flex-col overflow-hidden min-w-0">
```

`min-w-0` helps flex children shrink correctly.

---

## Step-by-step build order

### Step 1 — Incident header

```tsx
const isDark = theme === 'dark';

<div className={`p-4 border-b ${isDark ? 'border-[#2D334A]' : 'border-slate-200'}`}>
  <h1 className="text-xl font-black uppercase">{activeIncident.title}</h1>
  <p className="text-xs font-mono text-slate-400">{activeIncident.location}</p>
  <div className="flex gap-4 mt-2 text-xs">
    <span className="text-[#E63946] font-bold">{activeIncident.severity}</span>
    <span>Priority {activeIncident.priority}</span>
    <span>Caller: {activeIncident.caller}</span>
    <span>Duration {activeIncident.duration}</span>
  </div>
</div>
```

Optional: show `currentTimeText` as “Ops clock” in a corner.

### Step 2 — Map container (relative box)

```tsx
<div className="relative flex-1 bg-[#0D101B] overflow-hidden">
  {/* SVG goes here */}
</div>
```

Dark map background works in both themes or use `isDark` for lighter map in light mode.

### Step 3 — SVG map (beginner-friendly approach)

You do **not** need Google Maps. Use a fixed-size SVG viewBox:

```tsx
<svg viewBox="0 0 500 300" className="w-full h-full">
  {/* Optional: gray roads as simple <path d="M..." stroke="..." /> */}
  {/* Incident pin */}
  <circle
    cx={activeIncident.coordinates.x}
    cy={activeIncident.coordinates.y}
    r="8"
    fill="#E63946"
    className="animate-pulse"
  />
</svg>
```

**Static decoration (optional):** draw 2–3 `<path>` lines as roads, a few `<rect>` as buildings. They can be hardcoded — they do not need to move.

**Pin label:**

```tsx
<text
  x={activeIncident.coordinates.x}
  y={activeIncident.coordinates.y - 12}
  fill="white"
  fontSize="10"
>
  {activeIncident.id}
</text>
```

### Step 4 — Map controls (UI only)

Floating buttons in corners (use `absolute`):

| Control | Icon (lucide) | Behavior |
|---------|---------------|----------|
| Zoom in | `Plus` | Optional: `useState` scale — not required for v1 |
| Zoom out | `Minus` | Same |
| Layers | `Layers` | Toggle visibility — can be visual only |
| Recenter | `Crosshair` | Scroll pin into view — optional |

Example:

```tsx
<button type="button" className="absolute bottom-4 right-4 p-2 bg-black/80 rounded-lg">
  <Plus className="w-4 h-4 text-white" />
</button>
```

### Step 5 — HUD overlays on map

Small boxes `absolute top-4 left-4` showing:

- GPS: `lat {activeIncident.coordinates.lat}, lng {activeIncident.coordinates.lng}`
- Status line: “TRIANGULATION LOCKED” (static text is OK)

### Step 6 — Timeline

Below map or overlay at bottom:

```tsx
<ul className="p-3 space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
  {activeIncident.timeline.map((entry, i) => (
    <li key={i}>
      <span className="text-slate-500">{entry.time}</span> — {entry.event}
    </li>
  ))}
</ul>
```

If `entry.isAlert`, use red text (optional field).

### Step 7 — Responder card(s)

At minimum show `activeIncident.responder`:

```tsx
<div className="p-3 border rounded-lg m-3">
  <h4 className="font-bold text-sm">{activeIncident.responder.name}</h4>
  <p className="text-xs text-slate-400">{activeIncident.responder.type}</p>
  <p className="text-xs font-mono">
    {activeIncident.responder.distance} · ETA {activeIncident.responder.eta}
  </p>
  <span className="text-emerald-400 text-xs">{activeIncident.responder.status}</span>
</div>
```

Optional second card “Hospital standby” as static mock.

---

## Optional: local state with `useState`

Allowed examples:

- `mapZoom` number for scaling SVG
- `showLayers` boolean

Not allowed without team agreement:

- Storing which incident is selected (parent owns that)

```tsx
import { useState } from 'react';
const [zoom, setZoom] = useState(1);
```

Apply: `transform={`scale(${zoom})`}` on a `<g>` wrapper in SVG.

---

## How to test

1. Dashboard → center column visible.  
2. Click different incidents in Evelyn’s sidebar → title, pin position, timeline change.  
3. `INC-0042` vs `INC-0045` should have different `coordinates.x/y`.  
4. Resize window — map should grow/shrink (`flex-1`).

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Pin always same place | Use `activeIncident.coordinates`, not hardcoded x/y |
| Map not visible | Give parent `flex-1` and SVG `w-full h-full` |
| Forgot `theme` | Header/timeline should respect dark/light |
| Huge SVG without viewBox | Always set `viewBox="0 0 500 300"` |

---

## Done checklist

- [ ] Header shows active incident details
- [ ] SVG map with pin at `coordinates.x/y`
- [ ] Lat/lng displayed somewhere
- [ ] Timeline lists all events
- [ ] Responder card shows ETA and status
- [ ] Map controls visible (even if zoom is cosmetic)
- [ ] Works when switching incidents
- [ ] `npm run build` passes
