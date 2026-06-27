/**
 * MERS-AI CTA / Login Section
 * Design: Emerald gradient card with login CTA, centered layout
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function CTASection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="signup"
      className="py-24 relative bg-background"
    >
      <div className="container" ref={ref}>
        <div
          className={`relative rounded-3xl overflow-hidden p-12 md:p-16 text-center bg-[linear-gradient(135deg,oklch(0.12_0.015_160)_0%,oklch(0.11_0.02_165)_50%,oklch(0.12_0.015_160)_100%)] border border-emerald/20 shadow-[0_0_60px_oklch(0.67_0.19_162_/_0.06)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] opacity-[0.12] pointer-events-none bg-[radial-gradient(ellipse,oklch(0.67_0.19_162)_0%,transparent_70%)] blur-[30px]" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <Shield size={20} className="text-emerald-600 mr-2" />
              <span className="text-emerald-600 font-semibold text-md">Authorized Personnel Access</span>
            </div>

            <h2 className="font-display font-bold text-[clamp(1.75rem,4vw,3rem)] leading-[1.15] tracking-[-0.02em] text-foreground mb-4">
              Ready to deploy
              <br />
              <span className="gradient-text">MERS-AI in your operations?</span>
            </h2>

            <p className="font-body text-[1.05rem] leading-[1.7] text-muted-foreground max-w-[520px] mx-auto mb-10">
              Request access or sign in to your dispatcher account. Built for Malaysian emergency services — reliable, multilingual, and ready for deployment.
            </p>

            {/* Login CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
              <Button asChild className='bg-emerald-600 w-40'>
                <a href="/authpage">
                  Request Access
                  <ArrowRight size={16} />
                </a>
              </Button>

            </div>

            <p className="mt-4 font-mono text-[0.72rem] text-slate-500">
              Secure access · Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

