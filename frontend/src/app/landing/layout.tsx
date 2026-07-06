/**
 * Forces the landing page to always render in dark mode, regardless of
 * the user's theme preference set in the dashboard.
 *
 * next-themes stores the chosen theme in localStorage and applies it to
 * <html>. Because the landing page is always dark-only (it has hardcoded
 * dark backgrounds, glassmorphism cards, etc.), we wrap everything in
 * class="dark" here so Tailwind's dark: variant and bg-background
 * CSS variables always resolve to their dark values.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  // `dark`            — activates Tailwind dark-variant & CSS variable overrides
  // `bg-background`   — explicitly sets black bg (dark-mode value) on this root element
  // `text-foreground` — explicitly sets white text (dark-mode value) so all children
  //                     inherit white, not the near-black light-mode colour from <body>
  return <div className="dark bg-background text-foreground">{children}</div>
}
