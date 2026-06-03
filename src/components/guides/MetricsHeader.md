# Guide: `MetricsHeader.tsx`

**Owner:** Somesh  
**File:** `src/components/MetricsHeader.tsx`  
**Where it appears:** Top of the screen on **every tab** (Dashboard, Simulation, Reports)

---

## What you are building

The **top navigation bar** for MERS-AI (Malaysia 999 dispatch). Users use it to:

- See the product name
- Switch between **Dashboard**, **Simulation**, and **Reports**
- See how many incidents are active, critical, or resolved
- See a **live clock**
- Switch **dark / light** theme
- See when a simulation is running

You are **not** building the main content below the header — only this bar.

---

## Before you code

### 1. Open the right file

`src/components/MetricsHeader.tsx` — it currently looks like:

```tsx
export function MetricsHeader(_props: MetricsHeaderProps) {
  return <header data-component="MetricsHeader" />;
}
```

Replace the empty `<header />` with your real UI. Keep `'use client'` at the top.

### 2. Understand “props”

The parent (`App.tsx`) passes data **into** your component. You must **use** every prop listed in `MetricsHeaderProps` (or your lead will ask why it is unused).

Rename `_props` to `props` and destructure:

```tsx
export function MetricsHeader({
  currentTab,
  setCurrentTab,
  theme,
  setTheme,
  activeCount,
  criticalCount,
  resolvedCount,
  currentTimeText,
  isSimulating,
}: MetricsHeaderProps) {
  // your JSX here
}
```

---

## Props explained (one by one)

| Prop | Type | What it means | What you should do |
|------|------|---------------|-------------------|
| `currentTab` | `'dashboard' \| 'simulation' \| 'reports'` | Which tab is active now | Style the active tab differently (e.g. red background) |
| `setCurrentTab` | function | Tells parent to change tab | Call on button click: `onClick={() => setCurrentTab('dashboard')}` |
| `theme` | `'dark' \| 'light'` | Current color mode | Pick background/text classes for dark vs light |
| `setTheme` | function | Tells parent to change theme | Toggle: `onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}` |
| `activeCount` | number | Incidents not resolved | Show as a badge, e.g. “Active: 3” |
| `criticalCount` | number | CRITICAL severity count | Show in red or with alert styling |
| `resolvedCount` | number | Closed incidents today | Show as green or neutral badge |
| `currentTimeText` | string | Time string like `14:22:08` | Display in the header (parent updates every second) |
| `isSimulating` | boolean | Simulation running? | If `true`, show a small “SIM LIVE” or pulsing dot |

You do **not** need `useState` for tab or theme — the parent already holds that state.

---

## Step-by-step build order

Do these in order. After each step, save and check the browser.

### Step 1 — Shell layout

Return a `<header>` that spans full width with flexbox:

```tsx
return (
  <header className="flex items-center justify-between px-4 py-3 border-b shrink-0">
  </header>
);
```

Use `theme === 'dark'` to pick classes, for example:

- Dark: `bg-[#0B0D12] border-[#2D334A] text-white`
- Light: `bg-white border-slate-200 text-slate-900`

### Step 2 — Left: branding

Add on the left:

- Title: **MERS-AI** (bold)
- Subtitle: **Malaysia 999 Unified Op-Center** (small, muted text)

Optional icons from lucide: `Radio`, `LayoutDashboard`.

### Step 3 — Center: tab buttons

Three `<button type="button">` elements:

1. Dashboard → `setCurrentTab('dashboard')`
2. Simulation → `setCurrentTab('simulation')`
3. Reports → `setCurrentTab('reports')`

Highlight when `currentTab === 'dashboard'` (etc.). Example pattern:

```tsx
const tabClass = (tab: typeof currentTab) =>
  currentTab === tab
    ? 'bg-[#E63946] text-white'
    : 'text-slate-400 hover:text-white';
```

Icons (optional): `LayoutDashboard`, `Sliders`, `FileText` from `lucide-react`.

### Step 4 — Metrics row

Show three small stat blocks:

- Active: `{activeCount}`
- Critical: `{criticalCount}`
- Resolved: `{resolvedCount}`

Use `font-mono` for numbers if you want the “control room” look.

### Step 5 — Right: clock + theme + simulation

- Clock: `Clock` icon + `{currentTimeText}`
- Theme button: `Sun` when dark (click → light), `Moon` when light (click → dark)
- If `isSimulating`: show `Radio` icon + text “SIMULATION LIVE”

### Step 6 — Polish

- `uppercase`, `tracking-wider`, `text-xs` for labels
- `cursor-pointer` on buttons
- `shrink-0` on header so it does not collapse

---

## Example: theme toggle button

```tsx
<button
  type="button"
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  aria-label="Toggle theme"
  className="p-2 rounded-lg border"
>
  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
</button>
```

---

## How to test your work

1. `npm run dev` → open http://localhost:3000  
2. Click each tab — main area should switch (even if other components are empty).  
3. Click theme toggle — background in `App.tsx` should change (dark/light).  
4. Open **Simulation** tab and run a sim (once ScenarioSimulator is built) — `isSimulating` indicator should appear.  
5. Run `npm run build` — must pass with no errors.

---

## Common beginner mistakes

| Mistake | Fix |
|---------|-----|
| Tab click does nothing | You forgot `onClick={() => setCurrentTab('...')}` |
| Theme does not change | Call `setTheme`, do not only change local CSS |
| Using `useState` for `currentTab` | Use props from parent instead |
| Removing `MetricsHeaderProps` | Keep the interface exactly as in the starter file |
| Importing `Incident` | You do not need it in this file |

---

## Done checklist

- [ ] Header visible on all three tabs
- [ ] Three tabs switch content
- [ ] `activeCount`, `criticalCount`, `resolvedCount` displayed
- [ ] Clock shows `currentTimeText`
- [ ] Theme toggle works
- [ ] `isSimulating` shows extra UI when true
- [ ] Dark and light both look readable
- [ ] `npm run build` passes

---

## When you are finished

1. Mark your row done in the team chat.  
2. Open a PR titled: `feat(ui): implement MetricsHeader`.  
3. Help **Somesh** (same person) or wait for review before starting `ScenarioSimulator.tsx` — see [ScenarioSimulator.md](./ScenarioSimulator.md).
