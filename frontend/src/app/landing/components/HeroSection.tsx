/**
 * MERS-AI Hero Section
 * Design: Full-viewport dark hero with Lightfall WebGL animation in background
 * Layout: Centered text over animated background, asymmetric badge row
 * Colors: Emerald primary, near-black background, white text
 */
import { ArrowRight } from 'lucide-react';
// @ts-ignore
import Lightfall from './Lightfall.jsx';
import { Button } from './ui/button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Lightfall WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Lightfall
          className=""
          dpr={1}
          mixBlendMode="normal"
          colors={['#10B981', '#059669', '#34D399', '#065F46']}
          backgroundColor="#ffffff"
          speed={0.6}
          streakCount={6}
          streakWidth={0.8}
          streakLength={1.2}
          glow={1.2}
          density={0.5}
          twinkle={0.7}
          zoom={2.5}
          backgroundGlow={0.4}
          opacity={0.85}
          mouseInteraction={true}
          mouseStrength={0.6}
          mouseRadius={0.7}
        />
      </div>

      {/* Radial gradient overlay for text readability */}
      <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(248,250,252,0.72)_0%,rgba(248,250,252,0.78)_60%,rgba(241,245,249,0.96)_100%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(11,17,14,0.75)_0%,rgba(11,17,14,0.75)_60%,rgba(11,17,14,0.95)_100%)]" />

      {/* Content */}
      <div className="relative z-10 container text-center">
        {/* Launch badge */}
        <div className="flex justify-center mb-6 animate-fade-up">
          
          <div className="flex justify-center mb-6">
            <span>Now in Early Access — Malaysia's First AI Dispatch System</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="animate-fade-up delay-100 font-display font-bold text-[clamp(2.5rem,6vw,5rem)] leading-[1.1] tracking-[-0.03em] text-foreground mb-5">
          Every Second Counts.
          <br />
          <span className="gradient-text">MERS-AI Makes Them Count.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up delay-200 mx-auto text-muted-foreground font-body text-[clamp(1rem,2vw,1.2rem)] leading-[1.7] max-w-[600px] mb-10">
          An AI-powered 999 dispatch assistant built for Malaysia — handling Malay, English, Chinese, and Manglish calls with real-time triage, SOP retrieval, and smart responder dispatch.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-up delay-300">
          <Button asChild className="bg-emerald-600 text-base">
            <a href="/authpage">
              Request Early Access
              <ArrowRight size={16} />
            </a>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-up delay-400 text-muted-foreground text-[0.8rem] font-mono">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="text-emerald">✓</span>
            Multi-language AI (BM / EN / ZH / Manglish)
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="text-emerald">✓</span>
            LangGraph Multi-Agent System
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="text-emerald">✓</span>
            Built for Malaysia's 999
          </span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-2 bg-[linear-gradient(to_bottom,hsl(var(--background)_/_0),hsl(var(--background)))]" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-up delay-600 text-muted-foreground">
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-emerald animate-scroll-dot" />
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
        .animate-scroll-dot {
          animation: scrollDot 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
