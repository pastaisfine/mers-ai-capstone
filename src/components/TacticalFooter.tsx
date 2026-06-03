'use client';

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

export function TacticalFooter(_props: TacticalFooterProps) {
  return <footer data-component="TacticalFooter" />;
}
