/**
 * MERS-AI Product Teaser Section
 * Design: Full-bleed dashboard mockup with overlay text, emerald border glow
 * Layout: Large image with floating stats overlay
 */
import { useEffect, useRef, useState } from 'react';
import { Activity, Shield, Cpu } from 'lucide-react';

const DASHBOARD_LIGHT_IMG = "/landing-dashboard-light.png";
const DASHBOARD_DARK_IMG = "/landing-dashboard-dark.png";

const stats = [
  { icon: Activity, value: '<2s', label: 'Triage time' },
  { icon: Cpu, value: '5', label: 'Parallel agents' },
  { icon: Shield, value: '100%', label: 'Operator control' },
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

export default function ProductSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="product"
      className="py-24 relative bg-muted/35 dark:bg-[oklch(0.08_0.01_160)] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-[0.05] pointer-events-none bg-[radial-gradient(ellipse,oklch(0.67_0.19_162)_0%,transparent_70%)] blur-[60px]" />

      <div className="container relative z-10" ref={ref}>
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-emerald" />
            <span className="section-label">The Product</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <h2 className="font-display font-bold text-[clamp(1.75rem,3.5vw,2.75rem)] leading-1.2 tracking-[-0.02em] text-foreground">
              The operator dashboard that{' '}
              <span className="gradient-text">keeps humans in command.</span>
            </h2>
            <p className="font-body text-[1rem] leading-[1.7] text-muted-foreground">
              A React-powered interface where AI recommendations surface alongside live transcripts, KL maps, and SOP citations — giving operators everything they need in one view, with full override capability.
            </p>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div
          className={`relative rounded-2xl overflow-hidden border border-emerald/20 shadow-[0_0_80px_oklch(0.67_0.19_162_/_0.08),_0_30px_70px_oklch(0_0_0_/_0.12)] dark:shadow-[0_0_80px_oklch(0.67_0.19_162_/_0.08),_0_40px_80px_oklch(0_0_0_/_0.4)] transition-all duration-800 delay-[150ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border dark:bg-[oklch(0.11_0.01_160)] dark:border-white/6">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.18_80)]" />
              <div className="w-3 h-3 rounded-full bg-emerald" />
            </div>
            <div className="flex-1 mx-4 rounded-md px-3 py-1 text-center bg-muted border border-border font-mono text-[0.7rem] text-muted-foreground dark:bg-[oklch(0.14_0.01_160)] dark:border-white/6">
              mers-ai.gov.my/dashboard
            </div>
            <div className="emerald-badge text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
              LIVE
            </div>
          </div>

          {/* Dashboard image */}
          <img
            src={DASHBOARD_LIGHT_IMG}
            alt="MERS-AI Operator Dashboard"
            className="w-full block dark:hidden"
          />
          <img
            src={DASHBOARD_DARK_IMG}
            alt="MERS-AI Operator Dashboard"
            className="hidden w-full dark:block"
          />

          {/* Bottom overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(to_top,hsl(var(--background)_/_0.5),hsl(var(--background)_/_0))] dark:bg-[linear-gradient(to_top,oklch(0.08_0.01_160_/_0.8),oklch(0.08_0.01_160_/_0))]" />
        </div>

        {/* Stats row */}
        <div
          className={`grid grid-cols-3 gap-4 mt-6 transition-all duration-600 delay-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald/10 border border-emerald/20">
                  <Icon size={14} className="text-emerald" />
                </div>
                <div>
                  <div className="font-display font-bold text-[1.2rem] text-foreground leading-none">
                    {stat.value}
                  </div>
                  <div className="font-body text-[0.75rem] text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
