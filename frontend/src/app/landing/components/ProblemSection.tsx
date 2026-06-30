/**
 * MERS-AI Problem Statement Section
 * Design: Dark background, high-contrast stat callouts, emerald accent lines
 * Layout: Asymmetric — large problem statement left, stat grid right
 */
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Clock, Users, PhoneCall } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    stat: '4–8 min',
    label: 'Average response delay',
    detail: 'Manual triage and dispatch adds critical minutes when every second matters.',
  },
  {
    icon: PhoneCall,
    stat: '40%',
    label: 'Calls in mixed languages',
    detail: 'Operators struggle with Manglish, dialect switches, and multilingual callers.',
  },
  {
    icon: Users,
    stat: '1 operator',
    label: 'Handling multiple emergencies',
    detail: 'Overwhelmed dispatchers juggle calls, SOPs, maps, and radio — simultaneously.',
  },
  {
    icon: AlertTriangle,
    stat: 'Zero AI',
    label: 'In Malaysia\'s 999 system',
    detail: 'No existing tool handles the complexity of Malaysian emergency dispatch.',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function ProblemSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="problem"
      className="py-24 relative bg-background overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(oklch(1_0_0)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container relative z-10" ref={ref}>
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-4 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="h-px flex-1 max-w-8 bg-emerald" />
          <span className="section-label">The Problem</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Problem statement */}
          <div
            className={`transition-all duration-[700ms] delay-[100ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.75rem)] leading-[1.2] tracking-[-0.02em] text-foreground">
              Malaysia's emergency dispatch system is running on{' '}
              <span className="gradient-text">human limits alone.</span>
            </h2>
            <p className="text-slate-300 font-body text-[1.05rem] leading-[1.75] mb-6">
              When a 999 call comes in, operators must simultaneously transcribe, triage, locate the caller, look up SOPs, and coordinate responders — all in real time, often in mixed languages, under extreme pressure.
            </p>
            <p className="text-slate-300 font-body text-[1.05rem] leading-[1.75]">
              No AI tool exists that understands the linguistic and operational complexity of Malaysian emergency response. Until now.
            </p>

            {/* Divider */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-slate-400 font-mono text-[0.8rem] tracking-[0.05em]">
                MERS-AI was built to change this — a co-pilot for every operator on Malaysia's frontline.
              </p>
            </div>
          </div>

          {/* Right: Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map((item, i) => {
              const Icon = item.icon;
              const statDelays = [
                'delay-[200ms]',
                'delay-[280ms]',
                'delay-[360ms]',
                'delay-[440ms]',
              ];
              return (
                <div
                  key={item.stat}
                  className={`glass-card p-5 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    statDelays[i] || 'delay-[200ms]'
                  } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-emerald/10 border border-emerald-400 bg-emerald-950">
                    <Icon size={16} className="text-emerald-500" />
                  </div>
                  <div className="font-display font-bold text-[1.5rem] text-foreground mb-1">
                    {item.stat}
                  </div>
                  <div className="font-display font-semibold text-[0.85rem] text-slate-300 mb-2">
                    {item.label}
                  </div>
                  <p className="font-body text-[0.8rem] leading-[1.6] text-slate-400">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
