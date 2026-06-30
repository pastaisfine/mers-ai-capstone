/**
 * MERS-AI Navbar
 * Design: Dark glassmorphism, emerald accent, Space Grotesk font
 * Behavior: Transparent on top, frosted glass on scroll
 */
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663787316997/gb22xsXfyGcqiVdZiXdoCR/mers-ai-logo-8rAi8mLYrmQj9KVwkQvDDZ.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Product', href: '#product' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-[20px] border-b border-white/6'
          : 'bg-transparent border-b-transparent'
      }`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden animate-pulse-ring bg-emerald/15 border border-emerald/40">
              <img src={LOGO_URL} alt="MERS-AI" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-white tracking-tight font-display font-bold text-[1.1rem]">
              MERS<span className="text-emerald">-AI</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 font-body text-slate-400 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/authpage" className="btn-emerald text-sm py-2 px-4">
              Request Access
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors text-slate-300 bg-transparent border-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
