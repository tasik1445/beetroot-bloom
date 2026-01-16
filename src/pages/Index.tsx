import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import OfferSection from '@/components/OfferSection';
import CheckoutSection from '@/components/CheckoutSection';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const scrollToCheckout = () => {
    document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TestimonialsSection />
      <OfferSection />
      <CheckoutSection />

      {/* Sticky Mobile CTA */}
      <div className="sticky-mobile-cta">
        <button onClick={scrollToCheckout} className="btn-hero w-full text-base py-4">
          🎁 এখনই অর্ডার করুন
        </button>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/8801XXXXXXXXX?text=হ্যালো,%20বিটরুট%20পাউডার%20সম্পর্কে%20জানতে%20চাই"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp এ যোগাযোগ করুন"
      >
        <MessageCircle size={28} />
      </a>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 px-4 text-center">
        <p className="text-sm opacity-80">© 2026 Organic Beetroot Powder Bangladesh. All rights reserved.</p>
        <p className="text-xs opacity-60 mt-2">প্রাকৃতিক স্বাস্থ্য পণ্য | 100% Organic | Lab Tested</p>
      </footer>
    </main>
  );
};

export default Index;
