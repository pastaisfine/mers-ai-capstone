/**
 * MERS-AI Footer
 * Design: Theme-aware, minimal, emerald accent links
 * Layout: Logo + tagline left, links center, socials right
 */

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

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-muted/35 dark:bg-[oklch(0.07_0.01_160)] dark:border-white/6">
      <div className="container py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-emerald/15 border border-emerald/40">
                <img src={LOGO_URL} alt="MERS-AI" className="w-5 h-5 object-contain" />
              </div>
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}
                className="text-foreground"
              >
                MERS<span style={{ color: 'oklch(0.67 0.19 162)' }}>-AI</span>
              </span>
            </a>
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                lineHeight: 1.7,
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
                className="text-foreground/80"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.8rem',
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
                      className="text-muted-foreground hover:text-foreground"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
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
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border dark:border-white/6"
        >
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
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
              className="text-muted-foreground"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
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
