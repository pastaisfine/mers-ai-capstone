import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Globe2,
  LayoutDashboard,
  MapPin,
  Network,
} from "lucide-react";

const features = [
  {
    icon: Globe2,
    tag: "🇲🇾 Malaysia-First",
    title: "Multilingual AI",
    description:
      "Handles Malay, English, Chinese, and Manglish calls natively. The only emergency AI built for Malaysia's linguistic reality.",
  },
  {
    icon: Network,
    tag: "🤖 LangGraph",
    title: "Multi-Agent System",
    description:
      "Parallel agents handle transcription, triage, location, SOP retrieval, and dispatch recommendations simultaneously — no bottlenecks.",
  },
  {
    icon: BookOpen,
    tag: "📋 Advanced RAG",
    title: "Live SOP Retrieval",
    description:
      "Pulls actual emergency SOPs (CPR, Bomba, flood protocols) in real time with proper citations. Operators know exactly why the AI recommends each action.",
  },
  {
    icon: MapPin,
    tag: "🗺️ Google Maps",
    title: "Geo-Intelligence",
    description:
      "Shows nearest responders, correlates multiple incidents in the same area, and calculates optimal dispatch routes in real time.",
  },
  {
    icon: LayoutDashboard,
    tag: "📊 React Dashboard",
    title: "Human-in-Control",
    description:
      "Operators stay in command — accept, reject, or override any AI decision. The system augments, never replaces, human judgment.",
  },
];

const connectorPaths = [
  "M 500 0 C 500 40, 150 30, 150 136", // Multilingual AI
  "M 500 0 C 500 48, 350 40, 350 136", // Live SOP Retrieval
  "M 500 0 C 500 48, 650 40, 650 136", // Human-in-Control
  "M 500 0 C 500 40, 850 30, 850 136", // Geo-Intelligence
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function FeaturesSection() {
  const { ref, inView } = useInView();
  const hubFeature =
    features.find((feature) => feature.title === "Multi-Agent System") ??
    features[1];
  const connectedFeatures = features.filter(
    (feature) => feature.title !== "Multi-Agent System",
  );
  const HubIcon = hubFeature.icon;

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-muted/35 py-24 dark:bg-[oklch(0.08_0.01_160)]"
    >
      <style>{`
        @keyframes connector-flow {
          to { stroke-dashoffset: -28; }
        }

        @keyframes connector-pulse {
          0%, 100% { opacity: 0.48; }
          50% { opacity: 0.95; }
        }

        @media (prefers-reduced-motion: reduce) {
          .connector-flow,
          .connector-node {
            animation: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[340px] w-[720px] -translate-x-1/2 bg-[radial-gradient(ellipse,oklch(0.67_0.19_162)_0%,transparent_70%)] opacity-[0.07] blur-[46px]" />

      <div className="container relative z-10" ref={ref}>
        <div
          className={`mb-16 text-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-emerald" />
            <span className="section-label">What Makes MERS-AI Different</span>
            <div className="h-px w-8 bg-emerald" />
          </div>
          <h2 className="mx-auto max-w-[640px] font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.2] tracking-[-0.02em] text-foreground">
            Built for the frontline.{" "}
            <span className="gradient-text">Engineered for speed.</span>
          </h2>
        </div>

        <div
          className={`relative transition-all delay-150 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
          }`}
        >
          {/* Central hub */}
          <div className="relative z-20 mx-auto max-w-3xl overflow-hidden rounded-2xl border border-emerald-500/25 bg-background/90 p-6 shadow-[0_18px_55px_-24px_rgba(16,185,129,0.42)] backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 shadow-[0_0_22px_rgba(16,185,129,0.12)]">
                <HubIcon size={19} className="text-emerald-500" />
              </div>
              <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                {hubFeature.tag}
              </span>
            </div>

            <div className="relative mt-4">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                <h3 className="font-display text-[1.1rem] font-semibold text-foreground">
                  {hubFeature.title}
                </h3>
              </div>
              <p className="max-w-2xl font-body text-[0.9rem] leading-[1.7] text-muted-foreground">
                {hubFeature.description}
              </p>
            </div>
          </div>

          {/* Desktop connector layer */}
          <div className="relative hidden h-36 lg:block" aria-hidden="true">
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1000 140"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="connector-gradient"
                  x1="500"
                  y1="0"
                  x2="500"
                  y2="140"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#10B981" stopOpacity="1" />
                  <stop offset="0.58" stopColor="#059669" stopOpacity="0.85" />
                  <stop offset="1" stopColor="#65A30D" stopOpacity="1" />
                </linearGradient>
                <filter
                  id="connector-glow"
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <marker
                  id="connector-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="9"
                  markerHeight="9"
                  orient="auto-start-reverse"
                >
                  <path d="M 1 1 L 9 5 L 1 9 Z" fill="#25ff03" />
                </marker>
              </defs>

              {connectorPaths.map((path, index) => (
                <g key={path}>
                  <path
                    d={path}
                    stroke="url(#connector-gradient)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.85"
                    markerEnd="url(#connector-arrow)"
                    filter="url(#connector-glow)"
                  />
                  <path
                    d={path}
                    className="connector-flow"
                    stroke="#A7F3D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="2 12"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.95"
                    style={{
                      animation: "connector-flow 2.8s linear infinite",
                      animationDelay: `${index * 140}ms`,
                    }}
                  />
                </g>
              ))}

              <circle
                cx="500"
                cy="2"
                r="4.5"
                fill="#10B981"
                filter="url(#connector-glow)"
              />
            </svg>
          </div>

          {/* Desktop destination cards */}
          <div className="relative z-10 hidden grid-cols-4 gap-4 lg:grid">
            {connectedFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative min-w-0 overflow-hidden rounded-2xl border border-border/75 bg-background/82 p-5 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400/30 hover:shadow-[0_20px_45px_-24px_rgba(16,185,129,0.30)] dark:border-white/[0.08] dark:bg-white/[0.035]"
                  style={{ transitionDelay: `${index * 35}ms` }}
                >
                  <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 transition-colors duration-300 group-hover:bg-emerald-500/15">
                      <Icon size={18} className="text-emerald-500" />
                    </div>
                    <span className="max-w-[150px] truncate rounded-full border border-border bg-background/65 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground dark:border-white/[0.08] dark:bg-white/[0.035]">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-[0.98rem] font-semibold leading-snug text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-body text-[0.8rem] leading-[1.65] text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>

          {/* ── Mobile & tablet connector layout (< lg) ─────────────────────────
              Strategy:
              • A short vertical stem drops from the hub's bottom-centre.
              • On mobile (1 col) each card has its own left-side vertical rail
                segment + a horizontal branch leading to the card.
              • On tablet (sm: 2 cols) we switch to a centred vertical stem with
                branches going left and right to each column — no broken shared
                rail that only works for one column.
          ──────────────────────────────────────────────────────────────────── */}

          {/* Stem from hub down to the grid — shared by both breakpoints */}
          <div
            className="relative mx-auto mt-0 lg:hidden"
            aria-hidden="true"
          >
            {/* Vertical stem */}
            <div className="mx-auto h-8 w-px bg-gradient-to-b from-emerald-400/80 to-emerald-500/40" />
            {/* Origin dot */}
            <div className="mx-auto -mt-1.5 h-3 w-3 rounded-full border border-emerald-400/50 bg-background shadow-[0_0_10px_rgba(52,211,153,0.55)] flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* ── Mobile (single column) layout ── */}
          <div className="mt-3 lg:hidden sm:hidden block">
            {/* Continuous left rail */}
            <div className="relative pl-8">
              <div
                className="pointer-events-none absolute bottom-6 left-[7px] top-0 w-px bg-gradient-to-b from-emerald-400/70 via-emerald-500/30 to-lime-400/50"
                aria-hidden="true"
              />
              <div className="grid gap-4">
                {connectedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="relative">
                      {/* Horizontal branch */}
                      <span
                        className="pointer-events-none absolute -left-6 top-7 h-px w-6 bg-gradient-to-r from-emerald-500/55 to-lime-400/85"
                        aria-hidden="true"
                      />
                      {/* Arrow node on the rail */}
                      <span
                        className="pointer-events-none absolute -left-[1.375rem] top-[1.375rem] flex h-3.5 w-3.5 items-center justify-center rounded-full border border-lime-400/45 bg-background text-lime-500 shadow-[0_0_12px_rgba(132,204,22,0.28)]"
                        aria-hidden="true"
                      >
                        <ArrowRight size={9} strokeWidth={2.5} />
                      </span>
                      <article
                        className="group h-full rounded-2xl border border-border/75 bg-background/82 p-5 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 dark:border-white/[0.08] dark:bg-white/[0.035]"
                        style={{ transitionDelay: `${index * 35}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
                            <Icon size={18} className="text-emerald-500" />
                          </div>
                          <span className="truncate rounded-full border border-border bg-background/65 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground dark:border-white/[0.08] dark:bg-white/[0.035]">
                            {feature.tag}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-[1rem] font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="mt-2 font-body text-[0.84rem] leading-[1.65] text-muted-foreground">
                          {feature.description}
                        </p>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Tablet (2-column) layout ── */}
          <div className="mt-3 hidden sm:block lg:hidden">
            <div className="relative">
              {/* Centre vertical rail */}
              <div
                className="pointer-events-none absolute bottom-6 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-emerald-400/70 via-emerald-500/30 to-lime-400/50"
                aria-hidden="true"
              />

              <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                {connectedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const isLeft = index % 2 === 0;

                  return (
                    <div key={feature.title} className="relative">
                      {/* Horizontal branch from centre rail to card */}
                      <span
                        className={`pointer-events-none absolute top-7 h-px w-5 bg-gradient-to-r from-emerald-500/55 to-lime-400/85 ${
                          isLeft
                            ? "-right-5 bg-gradient-to-l"
                            : "-left-5"
                        }`}
                        aria-hidden="true"
                      />
                      {/* Arrow node sitting on the branch end near the rail */}
                      <span
                        className={`pointer-events-none absolute top-[1.375rem] flex h-3.5 w-3.5 items-center justify-center rounded-full border border-lime-400/45 bg-background text-lime-500 shadow-[0_0_12px_rgba(132,204,22,0.28)] ${
                          isLeft ? "-right-[1.375rem]" : "-left-[1.375rem]"
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowRight
                          size={9}
                          strokeWidth={2.5}
                          className={isLeft ? "rotate-180" : ""}
                        />
                      </span>

                      <article
                        className="group h-full rounded-2xl border border-border/75 bg-background/82 p-5 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 dark:border-white/[0.08] dark:bg-white/[0.035]"
                        style={{ transitionDelay: `${index * 35}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
                            <Icon size={18} className="text-emerald-500" />
                          </div>
                          <span className="truncate rounded-full border border-border bg-background/65 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground dark:border-white/[0.08] dark:bg-white/[0.035]">
                            {feature.tag}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-[1rem] font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="mt-2 font-body text-[0.84rem] leading-[1.65] text-muted-foreground">
                          {feature.description}
                        </p>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
