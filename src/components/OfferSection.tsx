import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

const OfferSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedPackage, setSelectedPackage] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  const packages = [
    { id: '100g', name: '100g Pack', price: 499, originalPrice: 699, label: 'Trial Size' },
    { id: '250g', name: '250g Pack', price: 999, originalPrice: 1200, label: 'Most Popular 🔥', popular: true },
    { id: '500g', name: '500g Pack', price: 1499, originalPrice: 1800, label: 'Best Value 💰' }
  ];

  const bonuses = [
    { icon: "🎁", title: "বিটরুট রেসিপি গাইড", value: "৳500", desc: "20+ সুস্বাদু ও পুষ্টিকর রেসিপি" },
    { icon: "🎁", title: "ফ্রি হোম ডেলিভারি", value: "৳100", desc: "সারা বাংলাদেশে ফ্রি ডেলিভারি" },
    { icon: "🎁", title: "হেলথ ট্র্যাকিং চার্ট", value: "৳300", desc: "30 দিনের progress tracking" },
    { icon: "🎁", title: "1:1 হেলথ কনসালটেশন", value: "৳1,000", desc: "পুষ্টিবিদের সাথে ফ্রি পরামর্শ" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedPkg = packages.find(p => p.id === selectedPackage)!;
  const totalPrice = selectedPkg.price * quantity;

  const scrollToCheckout = () => {
    document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-card" ref={ref}>
      <div className="container-organic max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-primary text-center mb-4">
            আজকের বিশেষ অফার - সীমিত সময়ের জন্য! 🎁
          </h2>
          <p className="text-lg md:text-xl text-destructive font-semibold text-center urgency-pulse mb-8">
            ⏰ মাত্র ৫০টি প্যাকেজ বাকি - দ্রুত অর্ডার করুন!
          </p>
        </motion.div>

        {/* Package Selection */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 right-4 bg-secondary text-white text-xs px-3 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              <p className="font-bold text-lg">{pkg.name}</p>
              <p className="text-sm text-muted-foreground mb-2">{pkg.label}</p>
              <p className="text-2xl font-bold text-primary">৳{pkg.price}</p>
              <p className="text-sm text-muted-foreground line-through">৳{pkg.originalPrice}</p>
            </div>
          ))}
        </div>

        {/* Bonuses */}
        <div className="space-y-3 mb-8">
          <h3 className="font-bold text-xl">আপনি আরও পাচ্ছেন (ফ্রি!):</h3>
          {bonuses.map((bonus, i) => (
            <div key={i} className="bonus-card flex items-center gap-4">
              <span className="text-2xl">{bonus.icon}</span>
              <div className="flex-1">
                <p className="font-semibold">{bonus.title} <span className="text-accent">({bonus.value})</span></p>
                <p className="text-sm text-muted-foreground">{bonus.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Value Stack */}
        <div className="value-stack-box mb-8">
          <p className="text-lg mb-2">📦 মোট মূল্য: <span className="line-through opacity-70">৳3,199</span></p>
          <p className="text-3xl md:text-4xl font-bold mb-2">✅ আজকের অফার: মাত্র ৳{selectedPkg.price}</p>
          <p className="text-gold text-xl">💰 আপনি সাশ্রয় করছেন: ৳{3199 - selectedPkg.price}</p>
        </div>

        {/* Countdown */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground mb-2">⏰ অফার শেষ হবে:</p>
          <div className="inline-flex gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-mono text-2xl font-bold">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="font-medium">পরিমাণ:</span>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-secondary text-white flex items-center justify-center">
            <Minus size={18} />
          </button>
          <span className="text-xl font-bold w-8 text-center">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-lg bg-secondary text-white flex items-center justify-center">
            <Plus size={18} />
          </button>
        </div>

        {/* Total */}
        <p className="text-center text-2xl font-bold text-primary mb-6">মোট মূল্য: ৳{totalPrice}</p>

        {/* CTA */}
        <button onClick={scrollToCheckout} className="btn-hero pulse-cta w-full text-lg">
          🛒 এখনই অর্ডার করুন - Cash on Delivery
        </button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ✅ ৭ দিনের মানি-ব্যাক গ্যারান্টি | 🔒 নিরাপদ অর্ডার | 💳 Cash on Delivery
        </p>
      </div>
    </section>
  );
};

export default OfferSection;
