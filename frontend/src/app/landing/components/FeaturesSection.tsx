/**
 * MERS-AI Features Section
 * Design: Dark, 3-column glass card grid with emerald icon accents
 * Layout: Section label + headline + 6-card grid (2 rows of 3)
 */
import { useEffect, useRef, useState } from 'react';
import {
  Globe2,
  Network,
  BookOpen,
  MapPin,
  LayoutDashboard,
  FlaskConical,
} from 'lucide-react';

const AGENT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663787316997/gb22xsXfyGcqiVdZiXdoCR/mers-ai-feature-agents-gSudV5QYyVZ4R4b4kNiHuw.webp";

const features = [
  {
    icon: Globe2,
    tag: '🇲🇾 Malaysia-First',
    title: 'Multilingual AI',
    description:
      'Handles Malay, English, Chinese, and Manglish calls natively. The only emergency AI built for Malaysia\'s linguistic reality.',
    highlight: true,
  },
  {
    icon: Network,
    tag: '🤖 LangGraph',
    title: 'Multi-Agent System',
    description:
      'Parallel agents handle transcription, triage, location, SOP retrieval, and dispatch recommendations simultaneously — no bottlenecks.',
  },
  {
    icon: BookOpen,
    tag: '📋 Advanced RAG',
    title: 'Live SOP Retrieval',
    description:
      'Pulls actual emergency SOPs (CPR, Bomba, flood protocols) in real time with proper citations. Operators know exactly why the AI recommends each action.',
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
  {
    icon: FlaskConical,
    tag: '🔥 Simulation',
    title: 'Disaster Scenario Engine',
    description:
      'Built-in simulation for flash floods in KL, highway accidents, and mass casualty events — demo-ready without real call data.',
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

export default function FeaturesSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="features"
      className="py-24 relative bg-[oklch(0.08_0.01_160)] overflow-hidden"
    >
      {/* Emerald glow blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06] pointer-events-none bg-[radial-gradient(ellipse,oklch(0.67_0.19_162)_0%,transparent_70%)] blur-[40px]" />

      <div className="container relative z-10" ref={ref}>
        {/* Section header */}
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

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            const cardDelays = [
              'delay-[0ms]',
              'delay-[70ms]',
              'delay-[140ms]',
              'delay-[210ms]',
              'delay-[280ms]',
              'delay-[350ms]',
            ];
            return (
              <div
                key={feat.title}
                className={`glass-card p-6 flex flex-col gap-4 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  cardDelays[i] || 'delay-[0ms]'
                } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'} ${
                  feat.highlight ? 'border-emerald/30 bg-emerald/4' : ''
                }`}
              >
                {/* Icon + tag row */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald/12 border border-emerald-400 bg-emerald-950">
                    <Icon size={18} className="text-emerald-500" />
                  </div>
                  <span className="font-mono text-[0.7rem] text-slate-400 bg-white/4 border border-white/7 rounded-full px-2.5 py-1">
                    {feat.tag}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-display font-semibold text-[1.05rem] text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="font-body text-[0.875rem] leading-[1.65] text-muted-foreground">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agent network illustration */}
        <div
          className={`mt-16 rounded-2xl overflow-hidden relative border border-white/6 transition-all duration-800 delay-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        />
      </div>
    </section>
  );
}
