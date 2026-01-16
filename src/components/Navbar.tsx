import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'হোম', id: 'hero' },
    { label: 'সুবিধাসমূহ', id: 'problem' },
    { label: 'কেন বেছে নেবেন', id: 'solution' },
    { label: 'রিভিউ', id: 'testimonials' },
    { label: 'অফার', id: 'offer' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-organic px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-heading font-bold text-lg text-primary">
              Organic Beetroot
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+8801XXXXXXXXX"
              className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
            >
              <Phone size={18} />
              <span className="text-sm font-medium">কল করুন</span>
            </a>
            <button
              onClick={() => scrollToSection('checkout-form')}
              className="btn-hero py-2 px-4 text-sm"
            >
              <ShoppingCart size={16} className="mr-2" />
              অর্ডার করুন
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container-organic px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left py-2 px-3 text-foreground/80 hover:text-primary hover:bg-muted rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-border space-y-2">
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="flex items-center gap-2 py-2 px-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Phone size={18} />
                  <span className="font-medium">কল করুন</span>
                </a>
                <button
                  onClick={() => scrollToSection('checkout-form')}
                  className="btn-hero w-full py-3 text-sm"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  অর্ডার করুন
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
