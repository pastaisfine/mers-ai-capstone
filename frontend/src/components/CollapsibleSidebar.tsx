'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';

/**
 * CollapsibleSidebar
 *
 * Wraps the left incident-list panel with an open/close toggle.
 * When collapsed, the panel hides and only a thin toggle strip remains,
 * giving the map full horizontal space.
 *
 * Usage:
 *   <CollapsibleSidebar isDark={isDark}>
 *     <IncidentListPanel ... />   ← your existing left panel goes here
 *   </CollapsibleSidebar>
 */

interface CollapsibleSidebarProps {
  isDark: boolean;
  children: React.ReactNode;
  /** Width of the sidebar when open. Default: "w-80" (320 px) */
  openWidth?: string;
}

export function CollapsibleSidebar({
  isDark,
  children,
  openWidth = 'w-100',
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);


  return (
    <div className="relative flex h-full shrink-0 transition-all duration-300 ease-in-out
        ${isOpen ? openWidth : 'w-5'}">

      {/* ── Sidebar panel ── */}
      <div
        className={`
          h-full flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? 'flex-1' : 'w-0'}
          ${isDark ? 'bg-[#0D101B] border-r border-[#2D334A]' : 'bg-white border-r border-slate-200'}
        `}
      >
        {/* Prevent content from being visible while animating out */}
        <div className={`h-full flex flex-col min-w-[320px] transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {children}
        </div>
      </div>

      {/* ── Toggle tab (always visible) ── */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        title={isOpen ? 'Collapse incident list' : 'Expand incident list'}
        className={`
          absolute top-1/2 -translate-y-1/2 z-20
          flex flex-col items-center justify-center gap-1
          w-5 h-16 rounded-r-md
          transition-all duration-300 cursor-pointer
          right-0 translate-x-full
          ${
            isDark
              ? 'bg-[#1A2035] border border-l-0 border-[#2D334A] text-slate-400 hover:text-white hover:bg-[#252D45]'
              : 'bg-white border border-l-0 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }
        `}
      >
        {isOpen ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <>
            <LayoutList className="w-3 h-3" />
            <ChevronRight className="w-3 h-3" />
          </>
        )}
      </button>

      {/* ── Collapsed state: vertical label strip ── */}
      {!isOpen && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center pointer-events-none select-none
          `}
        >
          <span
            className={`
              text-[9px] font-mono font-bold tracking-[0.25em] uppercase
              -rotate-90 whitespace-nowrap
              ${isDark ? 'text-slate-600' : 'text-slate-300'}
            `}
          >
            INCIDENTS
          </span>
        </div>
      )}
    </div>
  );
}
