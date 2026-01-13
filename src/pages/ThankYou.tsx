import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-14 w-14 text-green-600" />
        </motion.div>

        <h1 className="font-heading text-3xl font-bold text-primary mb-2">
          অর্ডার সফল হয়েছে! 🎉
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          ধন্যবাদ! আপনার অর্ডার আমরা পেয়েছি।
        </p>

        {orderNumber && (
          <div className="bg-muted p-4 rounded-xl mb-6">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-xl font-bold text-primary">{orderNumber}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 mb-6 text-left">
          <h2 className="font-semibold text-lg mb-4">পরবর্তী পদক্ষেপ:</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">কনফার্মেশন কল</p>
                <p className="text-sm text-muted-foreground">
                  আমরা শীঘ্রই আপনাকে কল করব অর্ডার কনফার্ম করতে।
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">ডেলিভারি</p>
                <p className="text-sm text-muted-foreground">
                  ঢাকায় ২-৩ দিন এবং ঢাকার বাইরে ৩-৫ দিনের মধ্যে ডেলিভারি।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            📞 যেকোনো প্রশ্নে কল করুন: <span className="font-medium">01XXXXXXXXX</span>
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              হোম পেজে ফিরে যান
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
