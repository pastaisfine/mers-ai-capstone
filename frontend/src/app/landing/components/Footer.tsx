/**
 * MERS-AI Footer
 * Design: Dark, minimal, emerald accent links, social icons
 * Layout: Logo + tagline left, links center, socials right
 */
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663787316997/gb22xsXfyGcqiVdZiXdoCR/mers-ai-logo-8rAi8mLYrmQj9KVwkQvDDZ.png";

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Dashboard', href: '#product' },
    { label: 'Simulation Engine', href: '#features' },
  ],
  Technology: [
    { label: 'LangGraph Agents', href: '#features' },
    { label: 'Advanced RAG', href: '#features' },
    { label: 'Google Maps API', href: '#features' },
    { label: 'Multilingual NLP', href: '#features' },
  ],
  Company: [
    { label: 'About MERS-AI', href: '#' },
    { label: 'Early Access', href: '#signup' },
    { label: 'Contact', href: '#signup' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter / X' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{
        background: 'oklch(0.07 0.01 160)',
        borderTop: '1px solid oklch(1 0 0 / 0.06)',
      }}
    >
      <div className="container py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  background: 'oklch(0.67 0.19 162 / 0.15)',
                  border: '1px solid oklch(0.67 0.19 162 / 0.4)',
                }}
              >
                <img src={LOGO_URL} alt="MERS-AI" className="w-5 h-5 object-contain" />
              </div>
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}
                className="text-white"
              >
                MERS<span style={{ color: 'oklch(0.67 0.19 162)' }}>-AI</span>
              </span>
            </a>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                lineHeight: 1.7,
                color: 'oklch(0.48 0.01 160)',
                maxWidth: '280px',
                marginBottom: '1.5rem',
              }}
            >
              Malaysian Emergency Response System — AI. The first AI-powered 999 dispatch assistant built for Malaysia's frontline operators.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: 'oklch(0.75 0.01 160)',
                  marginBottom: '1rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.875rem',
                        color: 'oklch(0.48 0.01 160)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.75 0.01 160)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.48 0.01 160)')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8"
          style={{ borderTop: '1px solid oklch(1 0 0 / 0.06)' }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'oklch(0.38 0.01 160)',
            }}
          >
            © 2024 MERS-AI. Malaysian Emergency Response System — AI.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: 'oklch(0.67 0.19 162)',
                boxShadow: '0 0 6px oklch(0.67 0.19 162)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'oklch(0.45 0.01 160)',
              }}
            >
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
