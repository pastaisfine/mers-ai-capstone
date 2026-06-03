# Guide: `ActiveIncidentsList.tsx`

**Owner:** Evelyn  
**File:** `src/components/ActiveIncidentsList.tsx`  
**Where it appears:** **Dashboard** tab — **left column**

---

## What you are building

The **incident queue sidebar**. Operators see a list of emergency calls, search/filter them, and click one to select it. The center map and right panel update when selection changes (parent handles that — you only call `setSelectedIncidentId`).

---

## Visual layout (target)

```
┌─────────────────────────┐
│ ACTIVE INCIDENTS (3)    │
│ [Search...............] │
│ ALL | CRITICAL | ...  │
├─────────────────────────┤
│ INC-0042  CRITICAL      │
│ Suspected Cardiac...    │
│ Jalan Ampang...         │
├─────────────────────────┤
│ INC-0045  URGENT        │
│ ...                     │
└─────────────────────────┘
```

---

## Open the starter file

`src/components/ActiveIncidentsList.tsx` — change `_props` to destructured props:

```tsx
import type { Incident } from '../types';

export function ActiveIncidentsList({
  incidents,
  selectedIncidentId,
  setSelectedIncidentId,
  searchQuery,
  setSearchQuery,
  filterSeverity,
  setFilterSeverity,
  theme,
}: ActiveIncidentsListProps) {
```

Add `'use client'` at top (already there).

---

## Props explained

| Prop | What to do |
|------|------------|
| `incidents` | Array already **filtered** by parent — map over it to render rows |
| `selectedIncidentId` | Compare to `inc.id` to highlight selected row |
| `setSelectedIncidentId` | Call with `inc.id` when user clicks a row |
| `searchQuery` | Value of search `<input>` |
| `setSearchQuery` | `onChange={(e) => setSearchQuery(e.target.value)}` |
| `filterSeverity` | Current filter string (`'ALL'`, `'CRITICAL'`, etc.) |
| `setFilterSeverity` | Call when user clicks a filter pill |
| `theme` | `'dark'` or `'light'` for colors |

---

## Understanding `Incident` (each row)

From `src/types.ts`, each `inc` has at least:

| Field | Example | Show in list? |
|-------|---------|---------------|
| `id` | `INC-0042` | Yes — top left, red mono font |
| `title` | `Suspected Cardiac Arrest` | Yes — bold |
| `location` | `Jalan Ampang, KL` | Yes — small, truncated |
| `severity` | `CRITICAL` | Yes — badge color |
| `priority` | `94` | Optional |
| `type` | `medical` | Use for emoji icon |

### Type → emoji helper

```tsx
function incidentIcon(type: Incident['type']) {
  switch (type) {
    case 'fire': return '🔥';
    case 'medical': return '🚑';
    case 'accident': return '🚗';
    case 'crime': return '🚔';
    default: return '🚨';
  }
}
```

### Severity → colors (suggestion)

| Severity | Dark mode hint | Light mode hint |
|----------|----------------|-----------------|
| CRITICAL | red border / red text | red-50 background |
| URGENT | orange | orange |
| MODERATE | yellow | yellow |
| RESOLVED | gray, lower opacity | gray |

---

## Step-by-step build order

### Step 1 — Column container

```tsx
const isDark = theme === 'dark';

return (
  <aside
    className={`w-full lg:w-[320px] flex flex-col border-r shrink-0 ${
      isDark ? 'bg-[#0B0D12] border-[#2D334A]' : 'bg-white border-slate-200'
    }`}
  >
  </aside>
);
```

`shrink-0` stops the sidebar from squashing on wide screens.

### Step 2 — Header + count

```tsx
<h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
  Active Incidents ({incidents.length})
</h2>
```

### Step 3 — Search input

```tsx
import { Search } from 'lucide-react';

<div className="relative">
  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
  <input
    type="text"
    placeholder="Search ID, title, location..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border ..."
  />
</div>
```

### Step 4 — Filter pills

Loop over `['ALL', 'CRITICAL', 'URGENT', 'MODERATE', 'RESOLVED']`:

```tsx
{['ALL', 'CRITICAL', 'URGENT', 'MODERATE', 'RESOLVED'].map((f) => (
  <button
    key={f}
    type="button"
    onClick={() => setFilterSeverity(f)}
    className={filterSeverity === f ? 'bg-[#E63946] text-white' : '...'}
  >
    {f}
  </button>
))}
```

### Step 5 — Scrollable list

```tsx
<div className="flex-1 overflow-y-auto p-3 space-y-2">
  {incidents.map((inc) => {
    const selected = inc.id === selectedIncidentId;
    return (
      <div
        key={inc.id}
        role="button"
        tabIndex={0}
        onClick={() => setSelectedIncidentId(inc.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setSelectedIncidentId(inc.id);
        }}
        className={selected ? 'border-[#E63946] ...' : '...'}
      >
        {/* row content */}
      </div>
    );
  })}
</div>
```

### Step 6 — Empty state

If `incidents.length === 0`:

```tsx
<p className="text-center text-xs text-slate-400 p-8">No incidents match your filters.</p>
```

---

## How to test

1. Dashboard tab → sidebar on the left.  
2. Type in search — list should shrink (parent filters in `App.tsx`).  
3. Click filter pills — list updates.  
4. Click a row — center/right panels should show that incident’s data.  
5. Selected row looks different from others.

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| List never updates on search | Bind `value={searchQuery}` and `onChange` |
| Click does not change selection | Call `setSelectedIncidentId(inc.id)` |
| Filtering twice in child | Parent already filters; optional to filter again but not required |
| `key={index}` in map | Use `key={inc.id}` |

---

## Done checklist

- [ ] Search input works
- [ ] Five severity filters work
- [ ] List scrolls when many items
- [ ] Selected incident visually distinct
- [ ] Type icon + severity + id + title + location shown
- [ ] Dark and light themes
- [ ] `npm run build` passes
