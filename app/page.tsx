import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <Features />
      
      {/* About Us section */}
      <section id="about-us" className="py-20 bg-slate-50 text-center">
        <div className="container mx-auto px-4">
          <p className="text-slate-600">
            🚧 Security, Pricing, FAQ, and Footer sections coming next...
          </p>
        </div>
      </section>
    </main>
  );
}
