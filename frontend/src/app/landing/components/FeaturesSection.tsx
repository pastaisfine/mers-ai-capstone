/**
 * MERS-AI Features Section
 * Design: Dark feature network with emerald icon accents
 * Layout: Section label + headline + central Multi-Agent card connected to core capabilities
 */
import { useEffect, useRef, useState } from 'react';
import {
  Globe2,
  Network,
  BookOpen,
  MapPin,
  LayoutDashboard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Feature = {
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  highlight?: boolean;
  central?: boolean;
};

const features: Feature[] = [
  {
    icon: Globe2,
    tag: '🇲🇾 Malaysia-First',
    title: 'Multilingual AI',
    description:
      'Handles Malay, English, Chinese, and Manglish calls natively. The only emergency AI built for Malaysia\'s linguistic reality.',
    highlight: true,
  },
  {
    icon: BookOpen,
    tag: '📋 Advanced RAG',
    title: 'Live SOP Retrieval',
    description:
      'Pulls actual emergency SOPs (CPR, Bomba, flood protocols) in real time with proper citations. Operators know exactly why the AI recommends each action.',
  },
  {
    icon: Network,
    tag: '🤖 LangGraph',
    title: 'Multi-Agent System',
    description:
      'Parallel agents handle transcription, triage, location, SOP retrieval, and dispatch recommendations simultaneously — no bottlenecks.',
    central: true,
  },
  {
    icon: MapPin,
    tag: '🗺️ Google Maps',
    title: 'Geo-Intelligence',
    description:
      'Shows nearest responders, correlates multiple incidents in the same area, and calculates optimal dispatch routes in real time.',
  },
  {
    icon: LayoutDashboard,
    tag: '📊 React Dashboard',
    title: 'Human-in-Control',
    description:
      'Operators stay in command — accept, reject, or override any AI decision. The system augments, never replaces, human judgment.',
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

function FeatureCard({
  feature,
  className = '',
}: {
  feature: Feature;
  className?: string;
}) {
  const Icon = feature.icon;

  return (
    <div className={`glass-card p-6 flex flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="w-10 h-10 rounded-xl flex shrink-0 items-center justify-center bg-emerald/12 border border-emerald-400 bg-emerald-950">
          <Icon size={18} className="text-emerald-500" />
        </div>
        <span className="font-mono text-[0.7rem] text-muted-foreground bg-background/70 border border-border rounded-full px-2.5 py-1 dark:bg-white/4 dark:border-white/7">
          {feature.tag}
        </span>
      </div>

      <div>
        <h3 className="font-display font-semibold text-[1.05rem] text-foreground mb-2">
          {feature.title}
        </h3>
        <p className="font-body text-[0.875rem] leading-[1.65] text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const { ref, inView } = useInView();
  const centralFeature = features.find((feat) => feat.central);
  const connectedFeatures = features.filter((feat) => !feat.central);

  return (
    <section
      id="features"
      className="py-24 relative bg-muted/35 dark:bg-[oklch(0.08_0.01_160)] overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06] pointer-events-none bg-[radial-gradient(ellipse,oklch(0.67_0.19_162)_0%,transparent_70%)] blur-[40px]" />

      <div className="container relative z-10" ref={ref}>
        <div
          className={`text-center mb-16 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-emerald" />
            <span className="section-label">What Makes MERS-AI Different</span>
            <div className="h-px w-8 bg-emerald" />
          </div>
          <h2 className="font-display font-bold text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.2] tracking-[-0.02em] text-foreground max-w-[640px] mx-auto">
            Built for the frontline.{' '}
            <span className="gradient-text">Engineered for speed.</span>
          </h2>
        </div>

        <div className="relative max-w-[1180px] mx-auto">
          <div className="relative z-10">
            {centralFeature && (
              <FeatureCard
                feature={centralFeature}
                className={`max-w-[720px] mx-auto min-h-[185px] transition-all duration-600 delay-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
                } border-emerald/45 bg-emerald/6 shadow-[0_0_40px_rgba(16,185,129,0.16)]`}
              />
            )}
          </div>

          <div
            className={`hidden lg:block h-32 -mb-px transition-all duration-700 delay-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <svg
              aria-hidden="true"
              className="h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="feature-line-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.67 0.19 162)" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="oklch(0.76 0.17 141)" stopOpacity="1" />
                  <stop offset="100%" stopColor="oklch(0.85 0.15 120)" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="feature-arrow-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.67 0.19 162)" />
                  <stop offset="100%" stopColor="oklch(0.85 0.15 120)" />
                </linearGradient>
                <filter id="feature-line-glow" x="-20%" y="-40%" width="140%" height="180%">
                  <feGaussianBlur stdDeviation="1.1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <marker
                  id="feature-arrow"
                  markerWidth="5"
                  markerHeight="5"
                  refX="4.2"
                  refY="2.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,5 L4.6,2.5 z" fill="url(#feature-arrow-gradient)" />
                </marker>
              </defs>
              <path
                d="M50 0 V38 M12.5 38 H87.5"
                stroke="url(#feature-line-gradient)"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#feature-line-glow)"
              />
              {[12.5, 37.5, 62.5, 87.5].map((x, i) => (
                <line
                  key={x}
                  x1={x}
                  y1="38"
                  x2={x}
                  y2="99"
                  markerEnd="url(#feature-arrow)"
                  stroke="url(#feature-line-gradient)"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  filter="url(#feature-line-glow)"
                  style={{ transitionDelay: `${360 + i * 80}ms` }}
                />
              ))}
            </svg>
          </div>

          <div
            className={`relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 transition-all duration-600 delay-[280ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
            }`}
          >
            {connectedFeatures.map((feat, i) => {
              const cardDelays = [
                'delay-[210ms]',
                'delay-[280ms]',
                'delay-[350ms]',
                'delay-[420ms]',
              ];

              return (
                <FeatureCard
                  key={feat.title}
                  feature={feat}
                  className={`relative min-h-[260px] transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    cardDelays[i] || 'delay-[0ms]'
                  } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'} ${
                    feat.highlight ? 'bg-emerald/4' : ''
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
