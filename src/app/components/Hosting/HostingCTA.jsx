import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HostingCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-midnight-navy dark:bg-slate-900">
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1542744094-fe5a14cf3d37?w=2000&q=80"
          alt="CTA Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-midnight-navy dark:from-slate-900 via-deep-navy dark:via-charcoal-blue to-midnight-navy dark:to-slate-900"></div>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight-navy/80 dark:from-slate-900/80 via-deep-navy/50 dark:via-charcoal-blue/50 to-midnight-navy/80 dark:to-slate-900/80"></div>
      
      {/* Decorative Animated Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-champagne-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
        >
          Ready to Start<br />
          <span className="bg-gradient-to-r from-champagne-gold via-champagne-gold/70 to-champagne-gold bg-clip-text text-transparent">
            Hosting?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium"
        >
          Join our community of successful hosts and start earning today. With our easy setup process and powerful tools, you'll be ready to welcome guests in just a few minutes.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => navigate("/login?role=host")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 rounded-xl bg-gradient-to-r from-champagne-gold to-champagne-gold/90 text-midnight-navy hover:shadow-2xl hover:shadow-champagne-gold/50 transition-all font-bold text-lg flex items-center justify-center gap-2 group mx-auto"
        >
          Create Your Account
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
}
