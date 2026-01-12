import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import heroProduct from '@/assets/hero-product.jpg';

const HeroSection = () => {
  const scrollToCheckout = () => {
    document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    "100% জৈব বিটরুট - কোনো রাসায়নিক নেই",
    "Blood Pressure নিয়ন্ত্রণে সাহায্য করে",
    "শক্তি ও স্ট্যামিনা বৃদ্ধি করে প্রাকৃতিকভাবে",
    "সব বয়সের জন্য নিরাপদ"
  ];

  const trustBadges = [
    { icon: "🔬", text: "Lab Tested" },
    { icon: "🌿", text: "100% Organic" },
    { icon: "🇧🇩", text: "Made for Bangladesh" }
  ];

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-organic-pattern opacity-50" />
      
      {/* Decorative Organic Shapes */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container-organic relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)]">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Main Headline */}
            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-4">
              প্রাকৃতিক শক্তি ও সুস্বাস্থ্যের জন্য
              <br />
              <span className="text-secondary">100% অর্গানিক বিটরুট পাউডার</span>
            </h1>
            
            {/* English Subline */}
            <p className="text-lg md:text-xl lg:text-2xl text-foreground font-medium mb-4">
              Boost Energy & Control Blood Pressure Naturally
            </p>
            
            {/* Trust Subheadline */}
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              ৩,০০০+ স্বাস্থ্য-সচেতন পরিবারের বিশ্বস্ত পছন্দ | Lab-Tested | 100% Organic
            </p>
            
            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <span className="checkmark">
                    <Check size={16} />
                  </span>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Button */}
            <motion.button
              onClick={scrollToCheckout}
              className="btn-hero pulse-cta w-full sm:w-auto mb-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎁 ফ্রি গিফট পেতে এখনই অর্ডার করুন
            </motion.button>
            
            {/* Trust Badges Row */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="badge-trust"
                >
                  <span className="text-lg">{badge.icon}</span>
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right Column - Product Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-sage/20 rounded-3xl blur-2xl scale-90" />
            
            {/* Product Image */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img
                  src={heroProduct}
                  alt="100% জৈব বিটরুট পাউডার - প্রাকৃতিক স্বাস্থ্য পণ্য"
                  className="w-full h-auto rounded-3xl shadow-burgundy"
                  loading="eager"
                />
              </motion.div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
