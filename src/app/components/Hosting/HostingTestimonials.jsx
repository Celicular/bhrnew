import { motion } from "motion/react";
import { Star, MapPin, TrendingUp } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    location: "San Francisco, CA",
    earnings: "$18,500/year",
    rating: 5,
    quote: "BHR made hosting simple and profitable. I went from one room to managing three properties in just a year. The platform's tools are intuitive and the support team is amazing!"
  },
  {
    name: "James Rodriguez",
    location: "Austin, TX",
    earnings: "$24,300/year",
    rating: 5,
    quote: "I was skeptical at first, but the ROI speaks for itself. The guest screening and automated messaging saved me so much time. Now I focus on what I love—hosting great experiences."
  },
  {
    name: "Emma Thompson",
    location: "Brooklyn, NY",
    earnings: "$31,200/year",
    rating: 5,
    quote: "Best decision ever. BHR's guest protection and professional tools elevated my hosting game. My occupancy rate jumped from 65% to 92% within months!"
  }
];

export function HostingTestimonials() {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-white dark:bg-slate-900">
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=2000&q=80"
          alt="Testimonials Background"
          className="w-full h-full object-cover opacity-30 dark:opacity-20"
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white/40 dark:from-slate-900/40 via-white/50 dark:via-slate-900/50 to-white/40 dark:to-slate-900/40"></div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-champagne-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-dusty-sky-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-midnight-navy dark:text-white mb-4 drop-shadow-lg">
            Hear From Our<br />
            <span className="bg-gradient-to-r from-champagne-gold to-dusty-sky-blue bg-clip-text text-transparent">
              Successful Hosts
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-dusty-sky-blue/80 max-w-2xl mx-auto">
            Real stories from real hosts who are making thousands with BHR
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-champagne-gold/20 to-dusty-sky-blue/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
              
              <div className="relative h-full px-8 py-8 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-gray-200 dark:border-white/5 flex flex-col">
                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-5 h-5 fill-champagne-gold text-champagne-gold" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-800 dark:text-white/90 mb-6 flex-grow italic leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-champagne-gold/30 to-transparent mb-6"></div>

                {/* Host Info */}
                <div>
                  <h3 className="text-lg font-bold text-midnight-navy dark:text-white mb-1">
                    {testimonial.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-dusty-sky-blue/80 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{testimonial.location}</span>
                  </div>

                  {/* Earnings Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-champagne-gold/10 border border-champagne-gold/30 hover:bg-champagne-gold/20 transition-colors">
                    <TrendingUp className="w-4 h-4 text-champagne-gold" />
                    <span className="text-sm font-bold text-champagne-gold">
                      {testimonial.earnings}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
