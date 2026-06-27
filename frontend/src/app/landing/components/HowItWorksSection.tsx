/**
 * MERS-AI How It Works Section
 * Design: Numbered step flow with connecting lines, emerald accents
 * Layout: Vertical timeline-style on mobile, horizontal on desktop
 */
import { useEffect, useRef, useState } from 'react';
import { Mic, Brain, MapPinned, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Mic,
    title: 'Call Received',
    description: 'A 999 call comes in. MERS-AI instantly begins real-time transcription, detecting language automatically — Malay, English, Chinese, or Manglish.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Triage & SOP Match',
    description: 'Parallel agents assess severity, classify the emergency type, and retrieve the exact SOP with citations — CPR, Bomba protocol, flood response — in under 2 seconds.',
  },
  {
    number: '03',
    icon: MapPinned,
    title: 'Location & Dispatch',
    description: 'Google Maps integration pinpoints the caller, identifies nearest available responders, and generates an optimal dispatch recommendation.',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Operator Decides',
    description: 'The human operator reviews AI recommendations on the dashboard and accepts, rejects, or overrides. Full control stays with the frontline.',
  },
];

function useInView(threshold = 0.1) {
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

export default function HowItWorksSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="how-it-works"
      className="py-24 relative bg-background"
    >
      <div className="container" ref={ref}>
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-emerald" />
            <span className="section-label">How It Works</span>
            <div className="h-px w-8 bg-emerald" />
          </div>
          <h2 className="font-display font-bold text-[clamp(1.75rem,3.5vw,2.75rem)] leading-1.2 tracking-[-0.02em] text-foreground">
            From call to dispatch in{' '}
            <span className="gradient-text">under 3 seconds.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-0 relative">
          {/* Connecting line (desktop) */}
          <div
            className={`hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px z-0 bg-[linear-gradient(to_right,oklch(0.67_0.19_162_/_0),oklch(0.67_0.19_162_/_0.3)_20%,oklch(0.67_0.19_162_/_0.3)_80%,oklch(0.67_0.19_162_/_0))] transition-opacity duration-1000 delay-500 ease-in-out ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const stepDelays = [
              'delay-[100ms]',
              'delay-[220ms]',
              'delay-[340ms]',
              'delay-[460ms]',
            ];
            return (
              <div
                key={step.number}
                className={`flex flex-col items-center text-center px-4 relative z-10 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  stepDelays[i] || 'delay-[100ms]'
                } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                {/* Step circle */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 relative bg-card border border-emerald/35 shadow-[0_0_20px_oklch(0.67_0.19_162_/_0.15)]">
                  <Icon size={22} className="text-emerald" />
                  {/* Step number */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald text-background font-mono text-[0.65rem]">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-[1rem] text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-[0.85rem] leading-[1.65] text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
