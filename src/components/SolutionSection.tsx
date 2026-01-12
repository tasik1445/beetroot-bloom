import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import heroProduct from '@/assets/hero-product.jpg';

const SolutionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const valuePoints = [
    {
      headline: "100% জৈব (Organic) বিটরুট পাউডার",
      explanation: "কোনো রাসায়নিক, সংরক্ষক বা কৃত্রিম রং নেই"
    },
    {
      headline: "Blood Pressure নিয়ন্ত্রণে সাহায্য করে",
      explanation: "নাইট্রিক অক্সাইড উৎপাদন বাড়িয়ে রক্তচাপ কমায়"
    },
    {
      headline: "শক্তি ও স্ট্যামিনা বৃদ্ধি করে প্রাকৃতিকভাবে",
      explanation: "অ্যাথলেট ও ফিটনেস এন্থুসিয়াস্টদের প্রিয় পছন্দ"
    },
    {
      headline: "হজমশক্তি উন্নত করে",
      explanation: "প্রচুর ফাইবার সমৃদ্ধ - পেটের স্বাস্থ্য ভালো রাখে"
    },
    {
      headline: "Lab-Tested এবং সার্টিফাইড পণ্য",
      explanation: "বিএসটিআই অনুমোদিত ও পরীক্ষিত"
    },
    {
      headline: "সব বয়সের জন্য নিরাপদ (শিশু থেকে বয়স্ক)",
      explanation: "পার্শ্বপ্রতিক্রিয়া মুক্ত, প্রাকৃতিক উপাদান"
    },
    {
      headline: "সহজ ব্যবহার - পানি বা Smoothie-তে মিশিয়ে খান",
      explanation: "দিনে মাত্র 1 চামচ, যেকোনো সময়"
    }
  ];

  const differentiators = [
    {
      icon: "🇧🇩",
      title: "Bangladeshi Market-এর জন্য বিশেষভাবে প্রস্তুত",
      desc: "স্থানীয় স্বাস্থ্য চাহিদা মাথায় রেখে"
    },
    {
      icon: "🌱",
      title: "নিজস্ব Quality Control - প্রতিটি ব্যাচ পরীক্ষিত",
      desc: "আমরা কোনো মধ্যস্থতাকারী ছাড়া সরাসরি সরবরাহ করি"
    },
    {
      icon: "💚",
      title: "সততা ও স্বচ্ছতা আমাদের নীতি",
      desc: "যা প্রতিশ্রুতি দিই, তাই দিই - কোনো ফাঁকি নেই"
    }
  ];

  const scrollToTestimonials = () => {
    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-card relative overflow-hidden" ref={ref}>
      {/* Curved Top Edge SVG */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 100L1440 100L1440 0C1440 0 1080 100 720 100C360 100 0 0 0 0L0 100Z" fill="hsl(var(--card))" />
        </svg>
      </div>

      <div className="container-organic">
        {/* Solution Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl text-primary mb-6">
            প্রাকৃতিক উপায়ে এসব সমস্যার সমাধান
            <br />
            <span className="text-secondary">এখন আপনার হাতের মুঠোয় 🌿</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            বিটরুট পাউডার হলো প্রকৃতির এক অসাধারণ উপহার। শত শত বছর ধরে বিশ্বজুড়ে স্বাস্থ্য উন্নয়নে 
            ব্যবহৃত হচ্ছে। আমাদের 100% জৈব বিটরুট পাউডার বিশেষভাবে প্রক্রিয়াজাত করা হয় যাতে 
            সমস্ত পুষ্টিগুণ অক্ষুণ্ণ থাকে।
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Value Points */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-8">
              কেন আমাদের বিটরুট পাউডার বেছে নেবেন?
            </h3>
            
            <div className="space-y-5">
              {valuePoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <span className="checkmark mt-0.5">
                    <Check size={16} />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{point.headline}</p>
                    <p className="text-sm text-muted-foreground">{point.explanation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Images & Differentiation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Product Image Card */}
            <div className="rounded-2xl overflow-hidden shadow-card">
              <img
                src={heroProduct}
                alt="বিটরুট পাউডার পণ্য"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>

            {/* Differentiation Card */}
            <div className="p-8 rounded-2xl border-2 border-dashed border-accent bg-sage-light">
              <h4 className="font-heading font-bold text-xl text-foreground mb-6">
                আমরা কেন ভিন্ন?
              </h4>
              <div className="space-y-5">
                {differentiators.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground mb-4">
            প্রাকৃতিক স্বাস্থ্য উন্নয়নের যাত্রা শুরু করুন আজই 👇
          </p>
          <button
            onClick={scrollToTestimonials}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            দেখুন আমাদের গ্রাহকরা কী বলছেন
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
