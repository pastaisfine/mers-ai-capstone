'use client';

import { ArrowUpRight, Check, CheckCircle, X } from 'lucide-react';

/**
 * Bottom action bar (dashboard only): ignore, close, escalate, accept & dispatch.
 * See src/components/guides/TacticalFooter.md
 */

export interface TacticalFooterProps {
  theme: 'dark' | 'light';
  onIgnore: () => void;
  onCloseIncident: () => void;
  onEscalate: () => void;
  onAcceptAndDispatch: () => void;
  dispatchStatus: string;
}

export function TacticalFooter({
  theme,
  onIgnore,
  onCloseIncident,
  onEscalate,
  onAcceptAndDispatch,
  dispatchStatus,
}: TacticalFooterProps) {
  const isDark = theme === 'dark';
  const dispatched = dispatchStatus === 'DISPATCHED';

  const secondaryButtonClass = isDark
    ? 'border-[#2D334A] text-slate-300 hover:bg-white/10 hover:text-white'
    : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950';

  return (
    <footer
      data-component="TacticalFooter"
      className={`flex shrink-0 flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
        isDark ? 'bg-[#0B0D12] border-[#2D334A]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onIgnore}
          className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold uppercase transition-colors ${secondaryButtonClass}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Ignore
        </button>
        <button
          type="button"
          onClick={onCloseIncident}
          className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold uppercase transition-colors ${secondaryButtonClass}`}
        >
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          Close incident
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onEscalate}
          className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold uppercase transition-colors ${secondaryButtonClass}`}
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          Escalate
        </button>
        <button
          type="button"
          onClick={onAcceptAndDispatch}
          disabled={dispatched}
          className={`flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold uppercase text-white transition-colors ${
            dispatched
              ? 'cursor-not-allowed bg-emerald-600'
              : 'bg-[#E63946] shadow-sm hover:bg-red-600'
          }`}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          {dispatched ? 'Dispatched' : 'Accept & Dispatch'}
        </button>
      </div>
    </footer>
  );
}
