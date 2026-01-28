import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export function HostDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gradient-to-br dark:from-[#0f1219] dark:via-slate-900 dark:to-[#0f1219]">
      <Navbar initialBackground={false} />
      
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 right-10 w-96 h-96 bg-champagne-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-champagne-gold/5 rounded-full blur-3xl"></div>
          </div>

          {/* Main Content */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-champagne-gold mb-6"
          >
            Host Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold text-midnight-navy dark:text-white mb-8"
          >
            Coming Soon
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-xl mx-auto"
          >
            We're building an amazing dashboard experience for our hosts. Stay tuned for powerful tools to manage your properties!
          </motion.p>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-champagne-gold to-champagne-gold/90 text-midnight-navy hover:shadow-2xl hover:shadow-champagne-gold/50 transition-all font-semibold text-lg flex items-center justify-center gap-2 group mx-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
