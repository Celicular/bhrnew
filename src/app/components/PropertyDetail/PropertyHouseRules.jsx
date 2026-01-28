import { motion } from "motion/react";
import {
  PawPrint,
  Ban,
  Users,
  Volume2,
  UserX,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export function PropertyHouseRules({ rules, onViewAdditionalRules }) {
  if (!rules || Object.keys(rules).length === 0) return null;

  const predefined = rules.predefined || {};
  const custom = rules.custom || [];

  const hasAnyRules =
    Object.values(predefined).some((v) => v) || custom.length > 0;

  if (!hasAnyRules) return null;

  const ruleConfig = {
    pets_allowed: {
      icon: PawPrint,
      label: "Pets Allowed",
      color: "text-[color:var(--accent-policy-300)]",
    },
    no_smoking: {
      icon: Ban,
      label: "No Smoking",
      color: "text-[color:var(--destructive-light-600)]",
    },
    no_parties: {
      icon: Users,
      label: "No Parties",
      color: "text-orange-500",
    },
    no_loud_noise: {
      icon: Volume2,
      label: "No Loud Noise",
      color: "text-[color:var(--accent-tertiary-300)]",
    },
    no_unregistered_guests: {
      icon: UserX,
      label: "No Unregistered Guests",
      color: "text-[color:var(--destructive-light-600)]",
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 md:py-12 border-t border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-red-50/30 dark:from-slate-800/30 to-transparent rounded-xl px-6 md:px-8"
      id="house-rules"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-midnight-navy dark:text-white mb-8">
        House Rules
      </h2>

      <div className="space-y-8">
        {/* Predefined Rules */}
        {Object.keys(predefined).some((k) => predefined[k]) && (
          <div>
            <h3 className="text-xl font-serif text-midnight-navy dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-champagne-gold" />
              Important Rules
            </h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(predefined)
                .filter(([key, value]) => value && ruleConfig[key])
                .map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -2 }}
                    viewport={{ once: true }}
                    className="flex-1 min-w-[280px] p-4 bg-gradient-to-br from-red-50/50 dark:from-slate-800/50 to-red-50/20 dark:to-slate-700/20 rounded-xl border border-red-200/50 dark:border-red-900/30 hover:border-red-300/70 dark:hover:border-red-700/50 flex items-center gap-3 transition-all hover:shadow-md dark:hover:shadow-slate-900/30"
                  >
                    {(() => {
                      const Icon = ruleConfig[key].icon;
                      return (
                        <Icon
                          className={`w-6 h-6 flex-shrink-0 ${ruleConfig[key].color}`}
                        />
                      );
                    })()}
                    <span className="font-medium text-midnight-navy dark:text-white">
                      {ruleConfig[key].label}
                    </span>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Custom Rules */}
        {custom && custom.length > 0 && onViewAdditionalRules && (
          <button
            onClick={onViewAdditionalRules}
            className="flex items-center gap-2 px-4 py-2 text-champagne-gold hover:text-[color:var(--hover-dark)] dark:hover:text-champagne-gold/80 font-medium transition-colors"
          >
            See Additional Rules ({custom.length})
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.section>
  );
}
