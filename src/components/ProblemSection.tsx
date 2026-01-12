import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Battery, Activity, Pill, RefreshCw, Users } from 'lucide-react';

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const painPoints = [
    {
      icon: Battery,
      emoji: "😴",
      headline: "শরীরে শক্তি নেই? সারাদিন ক্লান্ত লাগে?",
      subtext: "কাজে মন বসে না, ছোট্ট কাজেও হাঁপিয়ে যান?"
    },
    {
      icon: Activity,
      emoji: "🩺",
      headline: "High Blood Pressure নিয়ে চিন্তায় আছেন?",
      subtext: "ওষুধ খেয়েও কন্ট্রোল হচ্ছে না? পার্শ্বপ্রতিক্রিয়ার ভয়?"
    },
    {
      icon: Pill,
      emoji: "💊",
      headline: "রাসায়নিক সাপ্লিমেন্ট খেয়ে পার্শ্বপ্রতিক্রিয়া হচ্ছে?",
      subtext: "পেটের সমস্যা, মাথা ঘোরা, বা অন্য কোনো জটিলতা?"
    },
    {
      icon: RefreshCw,
      emoji: "🔄",
      headline: "হজমশক্তি দুর্বল? কোষ্ঠকাঠিন্য সমস্যা?",
      subtext: "স্বাভাবিকভাবে খাবার হজম হয় না?"
    },
    {
      icon: Users,
      emoji: "👨‍👩‍👧‍👦",
      headline: "পরিবারের সবার জন্য নিরাপদ সমাধান খুঁজছেন?",
      subtext: "এমন কিছু চান যা বাচ্চা থেকে বয়স্ক সবাই খেতে পারবে?"
    }
  ];

  return (
    <section className="section-padding bg-muted/50 bg-organic-pattern" ref={ref}>
      <div className="container-organic">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl text-primary mb-4">
            এই সমস্যাগুলো কি আপনার জীবনকে কঠিন করে তুলছে?
          </h2>
          <p className="text-muted-foreground text-lg">
            Are these problems making your life difficult?
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-pain"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">{point.emoji}</span>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {point.headline}
                  </h3>
                  <p className="text-muted-foreground">
                    {point.subtext}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-xl md:text-2xl font-semibold italic text-accent mb-4">
            কিন্তু চিন্তার কিছু নেই... সমাধান আছে! 👇
          </p>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block text-3xl"
          >
            ⬇️
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
