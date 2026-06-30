# Guide: `TacticalFooter.tsx`

**Owner:** Qaeffy  
**File:** `src/components/TacticalFooter.tsx`  
**Where it appears:** **Bottom of screen**, only when **Dashboard** tab is active

---

## What you are building

A **fixed action bar** with four operator actions: ignore call, close incident, escalate to supervisor, and **accept & dispatch**. This is the last row of the dashboard layout.

`App.tsx` only renders you when `currentTab === 'dashboard'` — you do not need to check the tab yourself.

---

## Props (all are functions except theme and status)

```tsx
export function TacticalFooter({
  theme,
  onIgnore,
  onCloseIncident,
  onEscalate,
  onAcceptAndDispatch,
  dispatchStatus,
}: TacticalFooterProps) {
```

| Prop | When user clicks | What parent does (for your understanding) |
|------|------------------|-------------------------------------------|
| `onIgnore` | Ignore | Logs ignore in simulation feed |
| `onCloseIncident` | Close | Marks incident RESOLVED |
| `onEscalate` | Escalate | Logs escalation |
| `onAcceptAndDispatch` | Primary CTA | Dispatches responder unit |
| `dispatchStatus` | (display only) | `'READY'` or `'DISPATCHED'` etc. |

You never call these on page load — only inside `onClick`.

---

## Layout

Horizontal bar, full width:

```
[ Ignore ] [ Close incident ]     [ Escalate ] [ ✓ ACCEPT & DISPATCH ]
     ↑ secondary buttons                    ↑ primary (red/green)
```

```tsx
<footer className={`flex items-center justify-between px-4 py-3 border-t shrink-0 ${
  isDark ? 'bg-[#0B0D12] border-[#2D334A]' : 'bg-white border-slate-200'
}`}>
```

Use `flex gap-2` for button groups.

---

## Step-by-step

### Step 1 — Secondary buttons (left)

Three buttons, `type="button"`, uppercase small text:

```tsx
<button type="button" onClick={onIgnore} className="...">
  <X className="w-3.5 h-3.5" /> Ignore
</button>

<button type="button" onClick={onCloseIncident} className="...">
  <CheckCircle className="w-3.5 h-3.5" /> Close incident
</button>
```

Import `X`, `CheckCircle` from `lucide-react`.

### Step 2 — Escalate (right group, outline)

```tsx
<button type="button" onClick={onEscalate} className="border ...">
  <ArrowUpRight className="w-3.5 h-3.5" /> Escalate
</button>
```

### Step 3 — Primary dispatch button

```tsx
const dispatched = dispatchStatus === 'DISPATCHED';

<button
  type="button"
  onClick={onAcceptAndDispatch}
  disabled={dispatched}
  className={
    dispatched
      ? 'bg-emerald-600 cursor-not-allowed'
      : 'bg-[#E63946] hover:bg-red-600'
  }
>
  <Check className="w-4 h-4" />
  {dispatched ? 'DISPATCHED' : 'ACCEPT & DISPATCH'}
</button>
```

### Step 4 — Theme

Muted borders in dark mode, slate borders in light mode. Primary button should stand out in both.

---

## `dispatchStatus` values you might see

| Value | UI suggestion |
|-------|----------------|
| `'READY'` | Red “ACCEPT & DISPATCH” enabled |
| `'DISPATCHED'` | Green, disabled, label “DISPATCHED” |
| undefined / other | Treat as READY (parent uses `|| 'READY'`) |

---

## How to test

1. Dashboard only — footer should **not** show on Simulation or Reports tabs.  
2. Click **Accept & dispatch** — button should become dispatched state (parent sets status).  
3. Click **Close incident** — incident severity becomes RESOLVED in sidebar.  
4. Other buttons — no crash (check browser console).

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Footer on every tab | Do not import footer in other tabs; only `App.tsx` controls visibility |
| `onClick={onAcceptAndDispatch()}` | Wrong — use `onClick={onAcceptAndDispatch}` or `onClick={() => onAcceptAndDispatch()}` |
| No `type="button"` | Inside forms, buttons default to submit — always use `type="button"` |

---

## Done checklist

- [ ] Four buttons visible on dashboard
- [ ] Each `onClick` calls the correct prop
- [ ] Primary button reacts to `dispatchStatus`
- [ ] Icons from lucide-react
- [ ] Dark + light themes
- [ ] `npm run build` passes
