import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CheckoutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', package: '250g', quantity: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    { id: '100g', name: '100g Pack', price: 499 },
    { id: '250g', name: '250g Pack - Most Popular 🔥', price: 999 },
    { id: '500g', name: '500g Pack - Best Value', price: 1499 }
  ];

  const selectedPkg = packages.find(p => p.id === formData.package)!;
  const totalPrice = selectedPkg.price * formData.quantity;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = "দয়া করে সঠিক নাম লিখুন";
    if (!formData.phone || !/^01\d{9}$/.test(formData.phone)) newErrors.phone = "সঠিক ১১ ডিজিটের নম্বর দিন (01 দিয়ে শুরু)";
    if (!formData.address || formData.address.length < 20) newErrors.address = "সম্পূর্ণ ঠিকানা লিখুন (এলাকা ও জেলাসহ)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    
    toast({
      title: "অর্ডার সফল হয়েছে! ✅",
      description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
    });
    setIsSubmitting(false);
  };

  return (
    <section id="checkout-form" className="section-padding bg-background" ref={ref}>
      <div className="container-organic max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary text-center mb-2">
            শেষ সুযোগ - আজই অর্ডার করুন! 🔥
          </h2>
          <p className="text-center text-destructive font-semibold mb-8">
            ⚡ মাত্র ১৫টি প্যাকেজ বাকি | 🚚 আজ অর্ডার করলে ২-৩ দিনে ডেলিভারি
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card p-6 md:p-10 rounded-2xl border-2 border-secondary shadow-lifted"
        >
          <h3 className="font-heading font-semibold text-xl text-primary mb-2">
            অর্ডার ফর্ম - মাত্র ২ মিনিটে সম্পূর্ণ করুন
          </h3>
          <p className="text-muted-foreground mb-8">📞 আমরা কনফার্মেশনের জন্য ফোন করব</p>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-2">আপনার পূর্ণ নাম *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: মোহাম্মদ রহিম উদ্দিন"
                className={`input-organic ${errors.name ? 'error' : formData.name.length >= 3 ? 'valid' : ''}`}
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold mb-2">মোবাইল নম্বর (হোয়াটসঅ্যাপ) *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className={`input-organic ${errors.phone ? 'error' : /^01\d{9}$/.test(formData.phone) ? 'valid' : ''}`}
              />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block font-semibold mb-2">ডেলিভারি ঠিকানা *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="বাসা ১২, রোড ৫, ধানমন্ডি, ঢাকা-১২০৯"
                rows={3}
                className={`input-organic resize-none ${errors.address ? 'error' : formData.address.length >= 20 ? 'valid' : ''}`}
              />
              {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Package Selection */}
            <div>
              <label className="block font-semibold mb-2">প্যাকেজ নির্বাচন করুন *</label>
              <div className="space-y-2">
                {packages.map((pkg) => (
                  <label key={pkg.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.package === pkg.id ? 'border-secondary bg-terracotta-light' : 'border-border hover:border-secondary/50'}`}>
                    <input type="radio" name="package" value={pkg.id} checked={formData.package === pkg.id} onChange={(e) => setFormData({ ...formData, package: e.target.value })} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.package === pkg.id ? 'border-secondary bg-secondary' : 'border-muted-foreground'}`}>
                      {formData.package === pkg.id && <Check size={12} className="text-white" />}
                    </div>
                    <span className="flex-1 font-medium">{pkg.name}</span>
                    <span className="font-bold text-primary">৳{pkg.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-muted p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-primary">মোট মূল্য: ৳{totalPrice}</p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="btn-success w-full disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</> : '✅ অর্ডার কনফার্ম করুন - Cash on Delivery'}
            </button>

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ</p>
              <p>💳 Cash on Delivery - হাতে পণ্য পেয়ে টাকা দিন</p>
              <p>📦 ২-৩ দিনে ডেলিভারি গ্যারান্টি</p>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default CheckoutSection;
