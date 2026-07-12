'use client';
/**
 * MERS-AI Landing Page — Home
 * Design: Dark glassmorphism, emerald/Supabase theme, Space Grotesk + Inter
 * Sections: Navbar → Hero (Lightfall) → Problem → Features → How It Works → Product → CTA → Footer
 */
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ProductSection from './components/ProductSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden w-full relative bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductSection />
      <CTASection />
      <Footer />
    </div>
  );
}
