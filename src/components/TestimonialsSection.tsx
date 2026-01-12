import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Shield } from 'lucide-react';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      stars: 5,
      quote: "30 দিন ব্যবহারের পর আমার এনার্জি লেভেল অনেক বেড়েছে। Blood Pressure-ও নিয়ন্ত্রণে এসেছে। সকালে উঠেই পানিতে মিশিয়ে খাই। স্বাদও মন্দ না!",
      name: "রহিম আহমেদ",
      location: "ঢাকা",
      date: "15 Jan 2026"
    },
    {
      stars: 5,
      quote: "আমার বাবার ডায়াবেটিস আছে। ডাক্তার বলেছিলেন বিটরুট খেতে কিন্তু তাজা বিটরুট পাওয়া কঠিন। এই পাউডার দিয়ে সমাধান হয়ে গেছে। খুবই খুশি।",
      name: "সামিয়া খানম",
      location: "চট্টগ্রাম",
      date: "08 Jan 2026"
    },
    {
      stars: 5,
      quote: "I'm a fitness enthusiast. Started using this before workouts. Endurance has improved significantly. Plus it's organic - no side effects!",
      name: "Tanvir Hassan",
      location: "Sylhet",
      date: "12 Jan 2026"
    },
    {
      stars: 5,
      quote: "পুরো পরিবার মিলে খাচ্ছি। বাচ্চারাও মজা করে smoothie-এ মিশিয়ে খায়। পেটের সমস্যা অনেক কমে গেছে সবার।",
      name: "নাজমুল হক",
      location: "রাজশাহী",
      date: "20 Dec 2025"
    },
    {
      stars: 5,
      quote: "Quality অসাধারণ। Packaging ও ভালো। Delivery time-ও ঠিক ছিল। আমি recommend করব।",
      name: "Farzana Akter",
      location: "Khulna",
      date: "28 Dec 2025"
    },
    {
      stars: 4,
      quote: "Good product. Only suggestion - could have better instructions in Bengali. But overall satisfied with results.",
      name: "Kamal Uddin",
      location: "Barisal",
      date: "05 Jan 2026"
    }
  ];

  const trustBadges = [
    { icon: "🌿", text: "100% Organic Certified" },
    { icon: "🔬", text: "Lab Tested & Verified" },
    { icon: "👨‍👩‍👧‍👦", text: "Safe for All Ages" },
    { icon: "🇧🇩", text: "BSTI Approved" },
    { icon: "💚", text: "Money-Back Guarantee" }
  ];

  return (
    <section id="testimonials" className="section-padding bg-cream-warm" ref={ref}>
      <div className="container-organic">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl text-primary mb-2">
            ৩,০০০+ সন্তুষ্ট গ্রাহক আমাদের বিশ্বাস করেন
          </h2>
          <p className="text-lg text-muted-foreground">
            দেখুন তাদের বাস্তব অভিজ্ঞতা
          </p>
        </motion.div>

        {/* Rating Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-2 mb-12"
        >
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-lg font-semibold text-foreground">
            4.9/5 Stars <span className="text-muted-foreground font-normal">• 500+ Verified Reviews</span>
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
              className="card-testimonial"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
                {Array.from({ length: 5 - testimonial.stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-muted" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-foreground italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Customer Details */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">— {testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    📍 Verified Purchase
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {trustBadges.map((badge, index) => (
            <div key={index} className="badge-trust">
              <span className="text-xl">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Guarantee Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="guarantee-box max-w-2xl mx-auto"
        >
          <Shield className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
            ৭ দিনের মানি-ব্যাক গ্যারান্টি
          </h3>
          <p className="text-lg text-foreground mb-2">
            যদি ৭ দিনে সন্তুষ্ট না হন, 100% টাকা ফেরত
          </p>
          <p className="text-muted-foreground">
            কোনো প্রশ্ন ছাড়াই - এটাই আমাদের প্রতিশ্রুতি
          </p>
          <button className="text-sm text-secondary underline mt-4 hover:text-primary transition-colors">
            শর্তাবলী দেখুন
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
